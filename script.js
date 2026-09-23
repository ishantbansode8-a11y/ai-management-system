let selectedImage = null;

let reports =
    JSON.parse(
        localStorage.getItem("wasteReports")
    ) || [];



/* PAGE NAVIGATION */

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active");

        });


    document
        .getElementById(pageId)
        .classList.add("active");


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    if (pageId === "reports") {

        loadReports();

    }


    if (pageId === "admin") {

        loadAdmin();

    }

}



/* IMAGE PREVIEW */

function previewImage() {

    const input =
        document.getElementById("wasteImage");

    const preview =
        document.getElementById("preview");


    if (input.files.length === 0) {

        return;

    }


    selectedImage = input.files[0];


    preview.src =
        URL.createObjectURL(selectedImage);


    preview.style.display =
        "block";

}



/* AI SIMULATION */

function analyzeWaste() {

    if (!selectedImage) {

        alert(
            "Please upload a waste image first."
        );

        return;

    }


    const fileName =
        selectedImage.name.toLowerCase();


    let category;

    let confidence;

    let disposal;


    /*
       Prototype AI logic.

       Later this function can be replaced
       with a real TensorFlow/Python API.
    */


    if (
        fileName.includes("plastic") ||
        fileName.includes("bottle") ||
        fileName.includes("wrapper")
    ) {

        category = "Plastic";

        confidence = 94;

        disposal =
            "Place the item in recyclable plastic waste.";

    }

    else if (
        fileName.includes("paper") ||
        fileName.includes("book") ||
        fileName.includes("newspaper")
    ) {

        category = "Paper";

        confidence = 92;

        disposal =
            "Place the item in dry recyclable paper waste.";

    }

    else if (
        fileName.includes("glass") ||
        fileName.includes("bottle")
    ) {

        category = "Glass";

        confidence = 89;

        disposal =
            "Place the item in the designated glass recycling container.";

    }

    else if (
        fileName.includes("metal") ||
        fileName.includes("can")
    ) {

        category = "Metal";

        confidence = 91;

        disposal =
            "Place the item in recyclable metal waste.";

    }

    else if (
        fileName.includes("food") ||
        fileName.includes("organic")
    ) {

        category = "Organic";

        confidence = 96;

        disposal =
            "Place the waste in the wet/organic waste container.";

    }

    else {

        const categories = [
            "Plastic",
            "Paper",
            "Metal",
            "Glass",
            "Organic",
            "Cardboard",
            "General Waste"
        ];


        category =
            categories[
                Math.floor(
                    Math.random() *
                    categories.length
                )
            ];


        confidence =
            Math.floor(
                Math.random() * 10
            ) + 88;


        disposal =
            getDisposal(category);

    }


    displayResult(
        category,
        confidence,
        disposal
    );

}



/* DISPOSAL GUIDE */

function getDisposal(category) {

    const guides = {

        "Plastic":
            "Place the item in recyclable plastic waste.",

        "Paper":
            "Place the item in dry recyclable paper waste.",

        "Metal":
            "Place the item in recyclable metal waste.",

        "Glass":
            "Place the item in the designated glass recycling container.",

        "Organic":
            "Place the waste in the wet/organic waste container.",

        "Cardboard":
            "Flatten the cardboard and place it with paper recycling.",

        "General Waste":
            "Place the item in general/non-recyclable waste."

    };


    return guides[category];

}



/* SHOW RESULT */

function displayResult(
    category,
    confidence,
    disposal
) {

    document
        .getElementById("resultCard")
        .classList.remove("hidden");


    document
        .getElementById("category")
        .textContent = category;


    document
        .getElementById("confidence")
        .textContent =
        confidence + "%";


    document
        .getElementById("disposalText")
        .textContent =
        disposal;


    document
        .getElementById("progressBar")
        .style.width =
        confidence + "%";


    document
        .getElementById("resultImage")
        .src =
        URL.createObjectURL(
            selectedImage
        );


    window.currentResult = {

        category: category,

        confidence: confidence

    };

}



/* OPEN REPORT FORM */

function openReport() {

    if (!window.currentResult) {

        alert(
            "Please analyze waste first."
        );

        return;

    }


    document
        .getElementById("reportCategory")
        .value =
        window.currentResult.category;


    showPage("report");

}



/* SUBMIT REPORT */

function submitReport() {

    const category =
        document
            .getElementById("reportCategory")
            .value;


    const location =
        document
            .getElementById("location")
            .value;


    const description =
        document
            .getElementById("description")
            .value;


    if (!location) {

        alert(
            "Please enter the waste location."
        );

        return;

    }


    const report = {

        id:
            Date.now(),

        category:
            category,

        location:
            location,

        description:
            description,

        status:
            "Pending",

        date:
            new Date()
                .toLocaleString()

    };


    reports.push(report);


    localStorage.setItem(
        "wasteReports",
        JSON.stringify(reports)
    );


    alert(
        "Waste report submitted successfully!"
    );


    document
        .getElementById("location")
        .value = "";


    document
        .getElementById("description")
        .value = "";


    showPage("reports");

}



/* LOAD REPORTS */

function loadReports() {

    const list =
        document
            .getElementById("reportList");


    if (reports.length === 0) {

        list.innerHTML = `

            <div class="empty">

                <div>📋</div>

                <h3>
                    No reports yet
                </h3>

                <p>
                    Your submitted waste reports
                    will appear here.
                </p>

            </div>

        `;

        return;

    }


    list.innerHTML = "";


    reports
        .slice()
        .reverse()
        .forEach(report => {

            const item =
                document.createElement("div");


            item.className =
                "report-item";


            item.innerHTML = `

                <div>

                    <h3>
                        ${report.category}
                    </h3>

                    <p>
                        📍 ${report.location}
                    </p>

                    <small>
                        ${report.date}
                    </small>

                </div>

                <span class="badge">

                    ${report.status}

                </span>

            `;


            list.appendChild(item);

        });

}



/* ADMIN DASHBOARD */

function loadAdmin() {

    const total =
        reports.length;


    const pending =
        reports.filter(
            r => r.status === "Pending"
        ).length;


    const collected =
        reports.filter(
            r => r.status === "Collected"
        ).length;


    document
        .getElementById("totalReports")
        .textContent =
        total;


    document
        .getElementById("pendingReports")
        .textContent =
        pending;


    document
        .getElementById("collectedReports")
        .textContent =
        collected;


    const container =
        document
            .getElementById("adminReports");


    if (reports.length === 0) {

        container.innerHTML = `

            <p class="empty">
                No reports available.
            </p>

        `;

        return;

    }


    container.innerHTML = `

        <div class="admin-row">

            <strong>Category</strong>

            <strong>Location</strong>

            <strong>Status</strong>

            <strong>Action</strong>

        </div>

    `;


    reports
        .slice()
        .reverse()
        .forEach(report => {

            const row =
                document.createElement("div");


            row.className =
                "admin-row";


            row.innerHTML = `

                <span>
                    ${report.category}
                </span>

                <span>
                    ${report.location}
                </span>

                <span>
                    ${report.status}
                </span>

                <button
                    onclick="markCollected(${report.id})">

                    Mark Collected

                </button>

            `;


            container.appendChild(row);

        });

}



/* ADMIN UPDATE */

function markCollected(id) {

    reports =
        reports.map(report => {

            if (report.id === id) {

                report.status =
                    "Collected";

            }

            return report;

        });


    localStorage.setItem(
        "wasteReports",
        JSON.stringify(reports)
    );


    loadAdmin();

}