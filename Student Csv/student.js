const fs = require('fs');
const csv = require('csv-parser');

const inputFilePath = 'students.csv';
const outputFilePath = 'output.csv';

const students = {};

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on('data', (row) => {
    const rollNo = row['Roll No'];
    const subject = row['Subject'];
    const marks = row['Marks'];

    // Check if marks is a valid number
    if (!isNaN(parseInt(marks))) {
      if (!students[rollNo]) {
        // Create a new student object with the name from the first occurrence of the rollNo
        students[rollNo] = {
          name: row['Name'],
          marks: {},
        };
      }
      students[rollNo].marks[subject] = parseInt(marks);
    }
  })
  .on('end', () => {
    // Calculate average marks for each student
    const output = [];
    for (const rollNo in students) {
      const student = students[rollNo];
      const totalMarks = Object.values(student.marks).reduce((a, b) => a + b, 0);
      const numSubjects = Object.keys(student.marks).length;
      const averageMarks = totalMarks / numSubjects;

      // Check if average marks is a valid number
      if (!isNaN(averageMarks)) {
        output.push({
          'roll no': rollNo,
          name: student.name,
          'average marks': averageMarks,
        });
      }
    }

    // Write output to file
    const csvWriter = require('csv-writer').createObjectCsvWriter({
      path: outputFilePath,
      header: [
        { id: 'roll no', title: 'Roll no' },
        { id: 'name', title: 'Name' },
        { id: 'average marks', title: 'Average Marks' },
      ],
    });
    csvWriter.writeRecords(output)
      .then(() => console.log(`Output written to ${outputFilePath}`));
  });
