const List = require('../models/list.js');
const Student = require('../models/student.js');
const theHuxley = require('../modules/thehuxley/');
const moment = require('moment');

module.exports = {
  getNewLists: async (req, res) => {
    try {
      const requestLists = theHuxley.getFilteredLists();
      const requestDbLists = List.find({});
      const requestedLists = await requestLists;
      let dbLists = await requestDbLists;
      const removedLists = [];
      dbLists = dbLists.filter(async (dbList) => {
        if (!requestedLists.find(requestedList => requestedList.id === dbList.theHuxleyId)) {
          removedLists.push(List.findByIdAndRemove(dbList));
          return false;
        }
        return true;
      });
      await Promise.all(removedLists);
      await Promise.all(requestedLists.map((newList) => {
        if (!dbLists.find(dbList => dbList.theHuxleyId === newList.id)) {
          return theHuxley.getListProblems(newList.id)
            .then((problems) => {
              const refactoredProblems = problems.data.map(problem => ({
                name: problem.name,
                theHuxleyId: problem.id,
                score: problem.score,
              }));
              return List.create({
                title: newList.title,
                theHuxleyId: newList.id,
                totalScore: newList.score,
                endDate: newList.endDate,
                problems: refactoredProblems,
              });
            })
            .then(createdList => dbLists.push(createdList));
        }
        return undefined;
      }));
      return res.json(dbLists);
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  },

  getStudentList: async (studentId, listId) => {
    try {
      const foundList = await List.findById(listId);
      const studentList = {
        submissions: [],
      };
      studentList.list = {
        title: foundList.title,
        theHuxleyId: foundList.theHuxleyId,
        totalScore: foundList.totalScore,
        endDate: foundList.endDate,
      };
      if (foundList) {
        const foundStudent = await Student.findById(studentId);
        const getSubmissions = [];
        for (let i = 0; i < foundList.problems.length; i += 1) {
          getSubmissions.push(theHuxley.getStudentSubmissions(
            foundList.problems[i].theHuxleyId,
            foundStudent.theHuxleyId,
          ).then((submissions) => {
            const onDateSubmissions = submissions.data
              .filter(submission => moment(submission.submissionDate) < moment(foundList.endDate));
            let mainSubmission = { evaluation: 'EMPTY', id: 0 };
            if (onDateSubmissions.length > 0) {
              const correctSubmission = onDateSubmissions.find(submission => submission.evaluation === 'CORRECT');
              mainSubmission = correctSubmission || submissions.data[0];
            }
            const newSubmission = {
              tries: onDateSubmissions.length,
              problem: {
                name: foundList.problems[i].name,
                theHuxleyId: foundList.problems[i].theHuxleyId,
                score: foundList.problems[i].score,
              },
              theHuxleyId: mainSubmission.id,
              evaluation: mainSubmission.evaluation,
            };
            studentList.submissions[i] = newSubmission;
          }));
        }
        await Promise.all(getSubmissions);
        studentList.student = {
          name: foundStudent.name,
          login: foundStudent.login,
          theHuxleyId: foundStudent.theHuxleyId,
        };
        return studentList;
      }
      throw new Error('List not found');
    } catch (err) {
      throw new Error(err.message);
    }
  },

  getSubmissionCode: async (submissionHuxleyId) => {
    try {
      const foundCode = await theHuxley.getSubmissionCode(submissionHuxleyId);
      return foundCode.data;
    } catch (err) {
      throw new Error(err.message);
    }
  },

};
