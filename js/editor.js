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
    
    const referencesEditor = document.getElementById('referencesEditor');
    const referenceList = document.getElementById('referenceList');
    const addReferenceBtn = document.getElementById('addReferenceBtn');
    
    const visualPreview = document.getElementById('visualPreview');

    // Data model to store paper content
    let paperData = {
        title: "Conference Paper Title",
        authors: [
            {
                name: "Given Name Surname",
                dept: "Department Name",
                org: "Organization Name",
                city: "City, Country",
                email: "email@example.com"
            }
        ],
        abstract: "Your abstract goes here. Briefly summarize your paper.",
        keywords: "component, formatting, style, styling, insert",
        introduction: "Your introduction goes here. Explain the background and motivation for your work.",
        "related-work": "Your related work goes here. Discuss previous research in this area.",
        methodology: "Your methodology goes here. Explain how you conducted your research.",
        results: "Your results go here. Present the findings of your study.",
        discussion: "Your discussion goes here. Interpret the results and their implications.",
        conclusion: "Your conclusion goes here. Summarize the main points and future work.",
        references: [
            {
                id: "b1",
                authors: "G. Eason, B. Noble, and I. N. Sneddon",
                title: "On certain integrals of Lipschitz-Hankel type involving products of Bessel functions",
                publication: "Phil. Trans. Roy. Soc. London, vol. A247, pp. 529--551, April 1955."
            }
        ]
    };

    let currentSection = 'title';
    let currentLatexString = '';

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

    // Helper to format references to LaTeX
    function getReferencesLatex() {
        if (paperData.references.length === 0) return "";
        
        const refs = paperData.references.map(ref => {
            return `\\bibitem{${ref.id}} ${ref.authors}, \`\`${ref.title},'' ${ref.publication}`;
        }).join('\n');
        
        return `\\begin{thebibliography}{00}\n${refs}\n\\end{thebibliography}`;
    }

    // Update internal LaTeX string and visual preview
    function updateContent() {
        currentLatexString = `\\documentclass[conference]{IEEEtran}
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

\\title{${paperData.title}}

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
Please number citations consecutively within brackets \\cite{b1}.

${getReferencesLatex()}

\\end{document}`;

        // Update Visual HTML Preview
        let authorsHtml = paperData.authors.map(a => `
            <div class="vp-author-block">
                <div class="vp-author-name">${a.name}</div>
                <div class="vp-author-affil">${a.dept}<br>${a.org}<br>${a.city}<br>${a.email}</div>
            </div>
        `).join('');

        let refsHtml = paperData.references.map((r, i) => `
            <div class="vp-reference-item">[${i + 1}] ${r.authors}, "${r.title}," <i>${r.publication}</i></div>
        `).join('');

        visualPreview.innerHTML = `
            <div class="vp-title">${paperData.title}</div>
            <div class="vp-authors">${authorsHtml}</div>
            <div class="vp-body">
                <div class="vp-paragraph">
                    <span class="vp-abstract-heading">Abstract—</span><span class="vp-abstract-text">${paperData.abstract}</span>
                </div>
                <div class="vp-paragraph">
                    <span class="vp-keywords-heading">IEEE Keywords—</span><span class="vp-keywords-text">${paperData.keywords}</span>
                </div>
                
                <div class="vp-section-heading">I. Introduction</div>
                <div class="vp-paragraph">${paperData.introduction.replace(/\\n/g, '<br>')}</div>
                
                <div class="vp-section-heading">II. Related Work</div>
                <div class="vp-paragraph">${paperData['related-work'].replace(/\\n/g, '<br>')}</div>
                
                <div class="vp-section-heading">III. Methodology</div>
                <div class="vp-paragraph">${paperData.methodology.replace(/\\n/g, '<br>')}</div>
                
                <div class="vp-section-heading">IV. Results</div>
                <div class="vp-paragraph">${paperData.results.replace(/\\n/g, '<br>')}</div>
                
                <div class="vp-section-heading">V. Discussion</div>
                <div class="vp-paragraph">${paperData.discussion.replace(/\\n/g, '<br>')}</div>
                
                <div class="vp-section-heading">VI. Conclusion</div>
                <div class="vp-paragraph">${paperData.conclusion.replace(/\\n/g, '<br>')}</div>
                
                <div class="vp-section-heading">References</div>
                <div class="vp-references">
                    ${refsHtml}
                </div>
            </div>
        `;
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
                updateContent();
            });
        });

        // Attach event listeners to remove buttons
        document.querySelectorAll('.remove-author-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                paperData.authors.splice(index, 1);
                renderAuthorUI();
                updateContent();
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
        updateContent();
    });

    // Render Reference UI
    function renderReferenceUI() {
        referenceList.innerHTML = '';
        paperData.references.forEach((ref, index) => {
            const card = document.createElement('div');
            card.className = 'reference-card';
            
            card.innerHTML = `
                <button class="remove-reference-btn" data-index="${index}">Remove</button>
                <div class="form-group">
                    <label>Citation ID (e.g. b1)</label>
                    <input type="text" class="form-control reference-input" data-field="id" data-index="${index}" value="${ref.id}">
                </div>
                <div class="form-group">
                    <label>Authors</label>
                    <input type="text" class="form-control reference-input" data-field="authors" data-index="${index}" value="${ref.authors}">
                </div>
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" class="form-control reference-input" data-field="title" data-index="${index}" value="${ref.title}">
                </div>
                <div class="form-group">
                    <label>Publication Details</label>
                    <input type="text" class="form-control reference-input" data-field="publication" data-index="${index}" value="${ref.publication}">
                </div>
            `;
            referenceList.appendChild(card);
        });

        // Attach event listeners to new inputs
        document.querySelectorAll('.reference-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = e.target.getAttribute('data-index');
                const field = e.target.getAttribute('data-field');
                paperData.references[index][field] = e.target.value;
                updateContent();
            });
        });

        // Attach event listeners to remove buttons
        document.querySelectorAll('.remove-reference-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                paperData.references.splice(index, 1);
                renderReferenceUI();
                updateContent();
            });
        });
    }

    addReferenceBtn.addEventListener('click', () => {
        const newId = `b${paperData.references.length + 1}`;
        paperData.references.push({
            id: newId,
            authors: "Author Names",
            title: "Paper Title",
            publication: "Journal/Conference details, Year."
        });
        renderReferenceUI();
        updateContent();
    });

    // Handle input changes for normal fields
    function handleInputChange() {
        if (currentSection === 'title') {
            paperData.title = fieldInput1.value || "Conference Paper Title";
        } else if (currentSection !== 'authors' && currentSection !== 'references') {
            paperData[currentSection] = fieldInput2.value || `Your ${currentSection.replace('-', ' ')} goes here.`;
        }
        updateContent();
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
                referencesEditor.style.display = 'none';
                
                fieldLabel1.textContent = 'Paper Title';
                fieldInput1.placeholder = 'Enter your IEEE paper title...';
                fieldInput1.value = paperData.title !== "Conference Paper Title" ? paperData.title : "";
            } else if (currentSection === 'authors') {
                regularFormGroup1.style.display = 'none';
                regularFormGroup2.style.display = 'none';
                authorsEditor.style.display = 'block';
                referencesEditor.style.display = 'none';
                
                renderAuthorUI();
            } else if (currentSection === 'references') {
                regularFormGroup1.style.display = 'none';
                regularFormGroup2.style.display = 'none';
                authorsEditor.style.display = 'none';
                referencesEditor.style.display = 'block';
                
                renderReferenceUI();
            } else {
                regularFormGroup1.style.display = 'none';
                regularFormGroup2.style.display = 'block';
                authorsEditor.style.display = 'none';
                referencesEditor.style.display = 'none';
                
                fieldLabel2.textContent = `${sectionName} Content`;
                fieldInput2.placeholder = `Enter ${sectionName.toLowerCase()}...`;
                
                // Set existing value if any
                const defaultText = `Your ${currentSection.replace('-', ' ')} goes here.`;
                fieldInput2.value = paperData[currentSection] !== defaultText ? paperData[currentSection] : "";
            }
        });
    });

    // Initialize content
    updateContent();

    // Download functionality
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const blob = new Blob([currentLatexString], { type: 'text/plain' });
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
            
            a.download = `${safeTitle}.tex`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Preview functionality
    const previewBtn = document.getElementById('previewBtn');
    const editorWorkspace = document.querySelector('.editor-workspace');
    if (previewBtn && editorWorkspace) {
        previewBtn.addEventListener('click', () => {
            editorWorkspace.classList.toggle('preview-mode');
            if (editorWorkspace.classList.contains('preview-mode')) {
                previewBtn.textContent = 'Exit Preview';
                previewBtn.classList.remove('btn-secondary');
                previewBtn.classList.add('btn-primary');
            } else {
                previewBtn.textContent = 'Preview';
                previewBtn.classList.remove('btn-primary');
                previewBtn.classList.add('btn-secondary');
            }
        });
    }
});
