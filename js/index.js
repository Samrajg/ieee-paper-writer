document.addEventListener('DOMContentLoaded', () => {
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            const featuresSection = document.getElementById('features');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Dashboard logic
    const dashboardSection = document.getElementById('dashboardSection');
    const draftList = document.getElementById('draftList');

    function loadDrafts() {
        let drafts = [];
        try {
            drafts = JSON.parse(localStorage.getItem('ieee_paper_drafts')) || [];
        } catch (e) {
            drafts = [];
        }

        if (drafts.length > 0) {
            dashboardSection.style.display = 'block';
            renderDrafts(drafts);
        } else {
            dashboardSection.style.display = 'none';
        }
    }

    function renderDrafts(drafts) {
        draftList.innerHTML = '';
        
        // Sort by last modified (newest first)
        drafts.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

        drafts.forEach(draft => {
            const dateStr = new Date(draft.lastModified).toLocaleString();
            const card = document.createElement('div');
            card.className = 'draft-card';
            
            card.innerHTML = `
                <div class="draft-info">
                    <h3>${draft.title || 'Untitled Paper'}</h3>
                    <p>Last edited: ${dateStr}</p>
                </div>
                <div class="draft-actions">
                    <button class="btn-delete" data-id="${draft.id}">Delete</button>
                    <a href="editor.html?id=${draft.id}" class="btn-continue">
                        Continue Writing ➔
                    </a>
                </div>
            `;
            draftList.appendChild(card);
        });

        // Add event listeners for delete buttons
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (confirm('Are you sure you want to delete this draft?')) {
                    const idToDelete = e.target.getAttribute('data-id');
                    let currentDrafts = JSON.parse(localStorage.getItem('ieee_paper_drafts')) || [];
                    currentDrafts = currentDrafts.filter(d => d.id !== idToDelete);
                    localStorage.setItem('ieee_paper_drafts', JSON.stringify(currentDrafts));
                    loadDrafts();
                }
            });
        });
    }

    loadDrafts();
});
