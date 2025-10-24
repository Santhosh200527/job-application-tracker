document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("applicationForm");
  const tableBody = document.querySelector("#applicationTable tbody");
  const exportBtn = document.getElementById("exportCSV");

  let applications = JSON.parse(localStorage.getItem("applications")) || [];

  function saveApplications() {
    localStorage.setItem("applications", JSON.stringify(applications));
  }

  function renderApplications() {
    tableBody.innerHTML = "";
    applications.forEach((app, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${app.company}</td>
        <td>${app.position}</td>
        <td>${app.status}</td>
        <td>${app.date}</td>
        <td>
          <button class="action-btn edit-btn" data-index="${index}">Edit</button>
          <button class="action-btn delete-btn" data-index="${index}">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

    addRowEventListeners();
  }

  function addRowEventListeners() {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        applications.splice(index, 1);
        saveApplications();
        renderApplications();
      });
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const app = applications[index];

        document.getElementById("company").value = app.company;
        document.getElementById("position").value = app.position;
        document.getElementById("status").value = app.status;
        document.getElementById("date").value = app.date;

        form.setAttribute("data-edit-index", index);
        form.querySelector("button[type='submit']").textContent = "Update Application";
      });
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const company = document.getElementById("company").value.trim();
    const position = document.getElementById("position").value.trim();
    const status = document.getElementById("status").value;
    const date = document.getElementById("date").value;

    const newApp = { company, position, status, date };

    const editIndex = form.getAttribute("data-edit-index");

    if (editIndex !== null) {
      applications[editIndex] = newApp;
      form.removeAttribute("data-edit-index");
      form.querySelector("button[type='submit']").textContent = "Add Application";
    } else {
      applications.push(newApp);
    }

    saveApplications();
    renderApplications();
    form.reset();
  });

  exportBtn.addEventListener("click", () => {
    if (applications.length === 0) {
      alert("No applications to export!");
      return;
    }

    const csvRows = [
      ["Company", "Position", "Status", "Date"]
    ];

    applications.forEach(app => {
      csvRows.push([app.company, app.position, app.status, app.date]);
    });

    const csvContent = csvRows.map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "job_applications.csv";
    a.click();

    URL.revokeObjectURL(url);
  });

  renderApplications();
});
