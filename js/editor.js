document.addEventListener('DOMContentLoaded', () => {
    const sectionItems = document.querySelectorAll('.section-item');
    const currentSectionTitle = document.getElementById('currentSectionTitle');
    const fieldLabel1 = document.getElementById('fieldLabel1');
    const fieldInput1 = document.getElementById('fieldInput1');
    const fieldLabel2 = document.getElementById('fieldLabel2');
    const fieldInput2 = document.getElementById('fieldInput2');
    const latexOutput = document.getElementById('latexOutput');

    // Data model to store paper content
    let paperData = {
        title: "Conference Paper Title*",
        authors: "\\IEEEauthorblockN{1\\textsuperscript{st} Given Name Surname}\n\\IEEEauthorblockA{\\textit{dept. name of organization (of Aff.)} \\\\\n\\textit{name of organization (of Aff.)}\\\\\nCity, Country \\\\\nemail address or ORCID}",
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

\\author{${paperData.authors}}

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

    // Handle input changes
    function handleInputChange() {
        if (currentSection === 'title') {
            paperData.title = fieldInput1.value || "Conference Paper Title*";
            // Ignore description (fieldInput2) for title
        } else if (currentSection === 'authors') {
            paperData.authors = fieldInput2.value || "Author Name";
        } else {
            paperData[currentSection] = fieldInput2.value || `Your ${currentSection.replace('-', ' ')} goes here.`;
        }
        updateLatex();
    }

    fieldInput1.addEventListener('input', handleInputChange);
    fieldInput2.addEventListener('input', handleInputChange);

    // Initial load: populate form with title
    fieldInput1.value = paperData.title;
    fieldInput2.parentElement.style.display = 'none';

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
                fieldInput1.parentElement.style.display = 'block';
                fieldInput2.parentElement.style.display = 'none';
                
                fieldLabel1.textContent = 'Paper Title';
                fieldInput1.placeholder = 'Enter your IEEE paper title...';
                fieldInput1.value = paperData.title !== "Conference Paper Title*" ? paperData.title : "";
            } else if (currentSection === 'authors') {
                fieldInput1.parentElement.style.display = 'none';
                fieldInput2.parentElement.style.display = 'block';
                
                fieldLabel2.textContent = 'Author Information (LaTeX)';
                fieldInput2.placeholder = 'Enter author names and affiliations...';
                fieldInput2.value = paperData.authors;
            } else {
                fieldInput1.parentElement.style.display = 'none';
                fieldInput2.parentElement.style.display = 'block';
                
                fieldLabel2.textContent = `${sectionName} Content`;
                fieldInput2.placeholder = `Enter ${sectionName.toLowerCase()}...`;
                
                // Set existing value if any
                const defaultText = `Your ${currentSection.replace('-', ' ')} goes here.`;
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
            a.download = 'paper.tex';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
});
