document.querySelector(".btn-success").addEventListener("click", function () {
    const studentProfile = document.querySelector(".card").innerHTML;
  
    // Convert HTML content to a PDF
    const doc = new jsPDF();
    doc.fromHTML(studentProfile, 10, 10, {
      width: 180,
    });
  
    // Save the PDF
    doc.save("Student_Profile.pdf");
  });
  