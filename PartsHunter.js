// PartsHunter.js - Universal Parts Finder App

class PartsHunter {
    constructor() {
        this.currentTab = 'home';
        this.userProfile = null;
        this.selectedCar = null;
        this.initializeApp();
    }

    initializeApp() {
        this.setupNavigation();
        this.renderHome();
    }

    setupNavigation() {
        const navTabs = ['home', 'findmycar', 'profile', 'diy', 'carinfo'];
        navTabs.forEach(tab => {
            const btn = document.getElementById(`tab-${tab}`);
            if (btn) btn.addEventListener('click', () => this.switchTab(tab));
        });
    }

    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
        document.getElementById(`content-${tab}`).style.display = 'block';
        this[`render${this.capitalize(tab)}`]();
    }

    renderHome() {
        const homeContent = document.getElementById('content-home');
        if (homeContent) {
            homeContent.innerHTML = `
                <div class="search-container">
                    <h2>Search Auto Parts</h2>
                    <div class="search-form">
                        <input type="text" id="parts-search" placeholder="Enter part name (e.g., brake pads, air filter, spark plugs)" />
                        <input type="text" id="car-model" placeholder="Car make/model (optional)" />
                        <button onclick="app.handleSearch()" id="search-btn">Search Parts</button>
                    </div>
                </div>
                <div id="search-results" class="search-results"></div>
            `;
        }
        console.log('Parts search interface loaded');
    }

    renderFindmycar() {
        console.log('Find your car by make, model, year');
    }

    renderProfile() {
        console.log('User profile and saved vehicles');
    }

    renderDiy() {
        console.log('DIY guides and tutorials');
    }

    renderCarinfo() {
        console.log('Car specifications and information');
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    handleSearch() {
        const searchQuery = document.getElementById('parts-search').value.trim();
        const carModel = document.getElementById('car-model').value.trim();
        
        if (!searchQuery) {
            alert('Please enter a part name to search');
            return;
        }

        // Show loading message
        const resultsDiv = document.getElementById('search-results');
        resultsDiv.innerHTML = '<div class="loading">Searching across Eurocar, GSF, and eBay...</div>';

        // Simulate API delay
        setTimeout(() => {
            const results = this.searchParts(searchQuery, carModel);
            this.displaySearchResults(results, searchQuery);
        }, 1000);
    }

    displaySearchResults(results, query) {
        const resultsDiv = document.getElementById('search-results');
        let html = `<h3>Search Results for "${query}"</h3>`;

        Object.keys(results).forEach(source => {
            const items = results[source];
            html += `
                <div class="source-section">
                    <h4>${source.toUpperCase()}</h4>
                    <div class="parts-grid">
            `;

            items.forEach(item => {
                const stockStatus = item.inStock ? 'in-stock' : 'out-of-stock';
                const stockText = item.inStock ? 'In Stock' : 'Out of Stock';
                
                html += `
                    <div class="part-item ${stockStatus}">
                        <div class="part-name">${item.name}</div>
                        <div class="part-price">${item.price}</div>
                        <div class="part-source">${item.source}</div>
                        <div class="part-stock ${stockStatus}">${stockText}</div>
                        <button class="add-to-cart" ${!item.inStock ? 'disabled' : ''}>
                            ${item.inStock ? 'Add to Cart' : 'Notify Me'}
                        </button>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        resultsDiv.innerHTML = html;
    }

    searchParts(query, carModel = '') {
        // Mock data for demonstration - would be replaced with actual API calls
        const mockResults = {
            eurocar: [
                { name: `${query} - Premium Quality`, price: '£45.99', source: 'Eurocar', inStock: true },
                { name: `${query} Set - OEM Grade`, price: '£62.50', source: 'Eurocar', inStock: true }
            ],
            gsf: [
                { name: `GSF ${query}`, price: '£38.75', source: 'GSF Car Parts', inStock: true },
                { name: `Professional ${query}`, price: '£55.20', source: 'GSF Car Parts', inStock: false }
            ],
            ebay: [
                { name: `${query} - Brand New`, price: '£29.99', source: 'eBay', inStock: true },
                { name: `${query} Kit Complete`, price: '£41.99', source: 'eBay', inStock: true },
                { name: `Used ${query}`, price: '£19.99', source: 'eBay', inStock: true }
            ]
        };
        
        // Filter results if car model is specified
        if (carModel) {
            Object.keys(mockResults).forEach(source => {
                mockResults[source] = mockResults[source].map(item => ({
                    ...item,
                    name: `${item.name} (${carModel})`
                }));
            });
        }
        
        return mockResults;
    }
}

const app = new PartsHunter();