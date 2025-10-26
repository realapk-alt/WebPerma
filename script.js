// Permanent Link Manager
class LinkManager {
    constructor() {
        this.links = JSON.parse(localStorage.getItem('permanentLinks')) || {};
        this.displayLinks();
    }

    // Add new permanent link
    addLink(name, actualUrl) {
        if (!name || !actualUrl) {
            this.showMessage('Please fill all fields', 'error');
            return;
        }

        // Create slug from name
        const slug = this.createSlug(name);
        
        // Store the link
        this.links[slug] = {
            name: name,
            actualUrl: actualUrl,
            permanentUrl: `${window.location.origin}${window.location.pathname}?redirect=${slug}`,
            createdAt: new Date().toISOString()
        };

        // Save to localStorage
        this.saveLinks();
        
        // Display success message
        this.showMessage(`Permanent link created successfully!`, 'success');
        
        // Display updated links
        this.displayLinks();
        
        // Clear form
        document.getElementById('linkName').value = '';
        document.getElementById('actualUrl').value = '';
    }

    // Create URL-friendly slug
    createSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }

    // Save links to localStorage
    saveLinks() {
        localStorage.setItem('permanentLinks', JSON.stringify(this.links));
    }

    // Display all links
    displayLinks() {
        const linksList = document.getElementById('linksList');
        
        if (Object.keys(this.links).length === 0) {
            linksList.innerHTML = `
                <h3>Your Permanent Links:</h3>
                <div class="link-item">
                    <p>No links created yet. Create your first permanent link above!</p>
                </div>
            `;
            return;
        }

        let html = '<h3>Your Permanent Links:</h3>';
        
        Object.entries(this.links).forEach(([slug, link]) => {
            html += `
                <div class="link-item">
                    <div class="link-name">${link.name}</div>
                    <div class="link-url">
                        <strong>Actual URL:</strong> ${link.actualUrl}
                    </div>
                    <div class="link-url">
                        <strong>Permanent URL:</strong> 
                        <span class="permanent-link">${link.permanentUrl}</span>
                    </div>
                    <div style="margin-top: 10px;">
                        <button onclick="copyToClipboard('${link.permanentUrl}')" class="btn" style="padding: 8px 15px; width: auto; margin-right: 10px;">
                            📋 Copy Permanent Link
                        </button>
                        <button onclick="editLink('${slug}')" class="btn" style="padding: 8px 15px; width: auto; background: #28a745;">