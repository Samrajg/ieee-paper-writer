document.addEventListener('DOMContentLoaded', () => {
    const sectionItems = document.querySelectorAll('.section-item');
    const currentSectionTitle = document.getElementById('currentSectionTitle');
    
    const regularFormGroup1 = document.getElementById('regularFormGroup1');
    const fieldLabel1 = document.getElementById('fieldLabel1');
    const fieldInput1 = document.getElementById('fieldInput1');
    
    const regularFormGroup2 = document.getElementById('regularFormGroup2');
    const fieldLabel2 = document.getElementById('fieldLabel2');
    const fieldInput2 = document.getElementById('fieldInput2');
    
    const authorsEditor = document.getElementById('authorsEditor');
    const authorList = document.getElementById('authorList');
    const addAuthorBtn = document.getElementById('addAuthorBtn');
    
    const latexOutput = document.getElementById('latexOutput');

    // Data model to store paper content
    let paperData = {
        title: "Conference Paper Title*",
        authors: [
            {
                name: "Given Name Surname",
                dept: "dept. name of organization (of Aff.)",
                org: "name of organization (of Aff.)",
                city: "City, Country",
                email: "email address or ORCID"
            }
        ],
        abstract: "This document is a model and instructions for \\LaTeX.",
        keywords: "component, formatting, style, styling, insert",
        introduction: "This document is a model and instructions for \\LaTeX.\nPlease observe the conference page limits.",
        "related-work": "Your related work goes here.",
        methodology: "Your methodology goes here.",
        results: "Your results go here.",
        discussion: "Your discussion goes here.",
        conclusion: "Your conclusion goes here.",
        references: "Please number citations consecutively within brackets \\cite{b1}.\n\n\\begin{thebibliography}{00}\n\\bibitem{b1} G. Eason, B. Noble, and I. N. Sneddon, ``On certain integrals of Lipschitz-Hankel type involving products of Bessel functions,'' Phil. Trans. Roy. Soc. London, vol. A247, pp. 529--551, April 1955.\n\\end{thebibliography}"
    };

    let currentSection = 'title';

    // Helper to format authors to LaTeX
    function getAuthorsLatex() {
        if (paperData.authors.length === 0) return "";
        
        return paperData.authors.map((author, index) => {
            let num = index + 1;
            let suffix = 'th';
            if (num === 1) suffix = 'st';
            else if (num === 2) suffix = 'nd';
            else if (num === 3) suffix = 'rd';
            
            return `\\IEEEauthorblockN{${num}\\textsuperscript{${suffix}} ${author.name}}
\\IEEEauthorblockA{\\textit{${author.dept}} \\\\
\\textit{${author.org}}\\\\
${author.city} \\\\
${author.email}}`;
        }).join('\n\\and\n');
    }

    // Update LaTeX display
    function updateLatex() {
        const latexTemplate = `\\documentclass[conference]{IEEEtran}
\\IEEEoverridecommandlockouts
% The preceding line is only needed to identify funding in the first footnote. If that is unneeded, please comment it out.
\\usepackage{cite}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{algorithmic}
\\usepackage{graphicx}
\\usepackage{textcomp}
\\usepackage{xcolor}
\\def\\BibTeX{{\\rm B\\kern-.05em{\\sc i\\kern-.025em b}\\kern-.08em
    T\\kern-.1667em\\lower.7ex\\hbox{E}\\kern-.125emX}}
\\begin{document}

\\title{${paperData.title}\\\\
{\\footnotesize \\textsuperscript{*}Note: Sub-titles are not captured in Xplore and
should not be used}
\\thanks{Identify applicable funding agency here. If none, delete this.}
}

\\author{${getAuthorsLatex()}}

\\maketitle

\\begin{abstract}
${paperData.abstract}
\\end{abstract}

\\begin{IEEEkeywords}
${paperData.keywords}
\\end{IEEEkeywords}

\\section{Introduction}
${paperData.introduction}

\\section{Related Work}
${paperData["related-work"]}

\\section{Methodology}
${paperData.methodology}

\\section{Results}
${paperData.results}

\\section{Discussion}
${paperData.discussion}

\\section{Conclusion}
${paperData.conclusion}

\\section*{References}
${paperData.references}

\\end{document}`;

        latexOutput.textContent = latexTemplate;
    }

    // Render Author UI
    function renderAuthorUI() {
        authorList.innerHTML = '';
        paperData.authors.forEach((author, index) => {
            const card = document.createElement('div');
            card.className = 'author-card';
            
            card.innerHTML = `
                <button class="remove-author-btn" data-index="${index}">Remove</button>
                <div class="form-group">
                    <label>Author Name</label>
                    <input type="text" class="form-control author-input" data-field="name" data-index="${index}" value="${author.name}">
                </div>
                <div class="form-group">
                    <label>Department</label>
                    <input type="text" class="form-control author-input" data-field="dept" data-index="${index}" value="${author.dept}">
                </div>
                <div class="form-group">
                    <label>Organization</label>
                    <input type="text" class="form-control author-input" data-field="org" data-index="${index}" value="${author.org}">
                </div>
                <div class="form-group">
                    <label>City, Country</label>
                    <input type="text" class="form-control author-input" data-field="city" data-index="${index}" value="${author.city}">
                </div>
                <div class="form-group">
                    <label>Email or ORCID</label>
                    <input type="text" class="form-control author-input" data-field="email" data-index="${index}" value="${author.email}">
                </div>
            `;
            authorList.appendChild(card);
        });

        // Attach event listeners to new inputs
        document.querySelectorAll('.author-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = e.target.getAttribute('data-index');
                const field = e.target.getAttribute('data-field');
                paperData.authors[index][field] = e.target.value;
                updateLatex();
            });
        });

        // Attach event listeners to remove buttons
        document.querySelectorAll('.remove-author-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                paperData.authors.splice(index, 1);
                renderAuthorUI();
                updateLatex();
            });
        });
    }

    addAuthorBtn.addEventListener('click', () => {
        paperData.authors.push({
            name: "New Author",
            dept: "Department",
            org: "Organization",
            city: "City, Country",
            email: "email"
        });
        renderAuthorUI();
        updateLatex();
    });

    // Handle input changes for normal fields
    function handleInputChange() {
        if (currentSection === 'title') {
            paperData.title = fieldInput1.value || "Conference Paper Title*";
        } else if (currentSection !== 'authors') {
            paperData[currentSection] = fieldInput2.value || \`Your \${currentSection.replace('-', ' ')} goes here.\`;
        }
        updateLatex();
    }

    fieldInput1.addEventListener('input', handleInputChange);
    fieldInput2.addEventListener('input', handleInputChange);

    // Initial load: populate form with title
    fieldInput1.value = paperData.title;
    regularFormGroup2.style.display = 'none';

    sectionItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove active class from all items
            sectionItems.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked item
            const clickedItem = e.target;
            clickedItem.classList.add('active');

            // Update center editor title and labels based on selection
            const sectionName = clickedItem.textContent;
            currentSection = clickedItem.getAttribute('data-section');
            currentSectionTitle.textContent = sectionName;

            // Reset and configure fields based on section
            if (currentSection === 'title') {
                regularFormGroup1.style.display = 'block';
                regularFormGroup2.style.display = 'none';
                authorsEditor.style.display = 'none';
                
                fieldLabel1.textContent = 'Paper Title';
                fieldInput1.placeholder = 'Enter your IEEE paper title...';
                fieldInput1.value = paperData.title !== "Conference Paper Title*" ? paperData.title : "";
            } else if (currentSection === 'authors') {
                regularFormGroup1.style.display = 'none';
                regularFormGroup2.style.display = 'none';
                authorsEditor.style.display = 'block';
                
                renderAuthorUI();
            } else {
                regularFormGroup1.style.display = 'none';
                regularFormGroup2.style.display = 'block';
                authorsEditor.style.display = 'none';
                
                fieldLabel2.textContent = \`\${sectionName} Content\`;
                fieldInput2.placeholder = \`Enter \${sectionName.toLowerCase()}...\`;
                
                // Set existing value if any
                const defaultText = \`Your \${currentSection.replace('-', ' ')} goes here.\`;
                fieldInput2.value = paperData[currentSection] !== defaultText ? paperData[currentSection] : "";
            }
        });
    });

    // Initialize the LaTeX block
    updateLatex();

    // Download functionality
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const latexContent = latexOutput.textContent;
            const blob = new Blob([latexContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Format filename from title
            let safeTitle = paperData.title
                .replace(/[^a-z0-9]/gi, '_')
                .replace(/_+/g, '_')
                .replace(/^_|_$/g, '')
                .toLowerCase();
            if (!safeTitle || safeTitle === 'conference_paper_title') {
                safeTitle = 'paper';
            }
            
            a.download = \`\${safeTitle}.tex\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
});
