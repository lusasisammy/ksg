// Application state
const state = {
    currentPage: 1,
    itemsPerPage: 10,
    inventory: [],
    departments: [],
    transactions: [],
    currentSection: 'dashboard'
};

// DOM Elements
const elements = {
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebar-toggle'),
    logoutBtn: document.getElementById('logout-btn'),
    contentSections: document.querySelectorAll('.content-section'),
    navItems: document.querySelectorAll('.nav-item'),
    addItemBtn: document.getElementById('add-item-btn'),
    addDepartmentBtn: document.getElementById('add-department-btn'),
    modals: document.querySelectorAll('.modal'),
    closeModalButtons: document.querySelectorAll('.close, .btn-secondary[data-modal]'),
    addItemForm: document.getElementById('add-item-form'),
    addDepartmentForm: document.getElementById('add-department-form'),
    inventoryTableBody: document.getElementById('inventory-table-body'),
    departmentsTableBody: document.getElementById('departments-table-body'),
    inventorySearch: document.getElementById('inventory-search'),
    departmentFilter: document.getElementById('department-filter'),
    categoryFilter: document.getElementById('category-filter'),
    conditionFilter: document.getElementById('condition-filter'),
    prevPageBtn: document.getElementById('prev-page'),
    nextPageBtn: document.getElementById('next-page'),
    pageInfo: document.getElementById('page-info'),
    totalItems: document.getElementById('total-items'),
    totalDepartments: document.getElementById('total-departments'),
    totalTransactions: document.getElementById('total-transactions'),
    lowStockCount: document.getElementById('low-stock-count'),
    recentTransactions: document.getElementById('recent-transactions'),
    lowStockAlerts: document.getElementById('low-stock-alerts'),
    itemDepartment: document.getElementById('item-department')
};

// Initialize the application
function initApp() {
    loadSampleData();
    setupEventListeners();
    updateDashboard();
    renderInventoryTable();
    renderDepartmentsTable();
    populateDepartmentFilters();
}

// Load sample data for demonstration
function loadSampleData() {
    // Sample departments
    state.departments = [
        { id: 1, name: 'IT Department', description: 'Information Technology', itemCount: 15 },
        { id: 2, name: 'Finance', description: 'Financial Operations', itemCount: 8 },
        { id: 3, name: 'HR', description: 'Human Resources', itemCount: 5 },
        { id: 4, name: 'Operations', description: 'Daily Operations', itemCount: 12 }
    ];

    // Sample inventory items
    state.inventory = [
        { id: 'IT-001', name: 'Laptop Dell XPS', category: 'Electronics', department: 'IT Department', quantity: 15, unitCost: 1200, condition: 'good' },
        { id: 'IT-002', name: 'Monitor 24"', category: 'Electronics', department: 'IT Department', quantity: 20, unitCost: 250, condition: 'new' },
        { id: 'FN-001', name: 'Calculator', category: 'Office Supplies', department: 'Finance', quantity: 8, unitCost: 45, condition: 'good' },
        { id: 'HR-001', name: 'Desk Chair', category: 'Furniture', department: 'HR', quantity: 12, unitCost: 150, condition: 'good' },
        { id: 'OP-001', name: 'Projector', category: 'Electronics', department: 'Operations', quantity: 5, unitCost: 500, condition: 'needs_repair' },
        { id: 'IT-003', name: 'Keyboard', category: 'Electronics', department: 'IT Department', quantity: 25, unitCost: 75, condition: 'new' },
        { id: 'FN-002', name: 'Filing Cabinet', category: 'Furniture', department: 'Finance', quantity: 4, unitCost: 200, condition: 'good' },
        { id: 'HR-002', name: 'Whiteboard', category: 'Office Supplies', department: 'HR', quantity: 7, unitCost: 90, condition: 'good' },
        { id: 'OP-002', name: 'Telephone', category: 'Electronics', department: 'Operations', quantity: 10, unitCost: 60, condition: 'new' },
        { id: 'IT-004', name: 'Server Rack', category: 'Electronics', department: 'IT Department', quantity: 2, unitCost: 1500, condition: 'needs_repair' }
    ];

    // Sample transactions
    state.transactions = [
        { item: 'Laptop Dell XPS', type: 'Check-out', quantity: 2, date: '2023-06-15' },
        { item: 'Monitor 24"', type: 'Check-in', quantity: 5, date: '2023-06-14' },
        { item: 'Calculator', type: 'Check-out', quantity: 3, date: '2023-06-13' },
        { item: 'Desk Chair', type: 'Check-out', quantity: 4, date: '2023-06-12' },
        { item: 'Projector', type: 'Maintenance', quantity: 1, date: '2023-06-11' }
    ];
}

// Set up all event listeners
function setupEventListeners() {
    // Sidebar toggle
    elements.sidebarToggle.addEventListener('click', toggleSidebar);
    
    // Logout button
    elements.logoutBtn.addEventListener('click', logout);
    
    // Navigation items
    elements.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // Add item button
    elements.addItemBtn.addEventListener('click', showAddItemModal);
    
    // Add department button
    elements.addDepartmentBtn.addEventListener('click', showAddDepartmentModal);
    
    // Close modal buttons
    elements.closeModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modalId = button.getAttribute('data-modal');
            closeModal(modalId);
        });
    });
    
    // Modal forms
    elements.addItemForm.addEventListener('submit', handleAddItem);
    elements.addDepartmentForm.addEventListener('submit', handleAddDepartment);
    
    // Inventory filters
    elements.inventorySearch.addEventListener('input', filterInventory);
    elements.departmentFilter.addEventListener('change', filterInventory);
    elements.categoryFilter.addEventListener('change', filterInventory);
    elements.conditionFilter.addEventListener('change', filterInventory);
    
    // Pagination
    elements.prevPageBtn.addEventListener('click', goToPrevPage);
    elements.nextPageBtn.addEventListener('click', goToNextPage);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
}

// Toggle sidebar visibility
function toggleSidebar() {
    elements.sidebar.classList.toggle('collapsed');
    document.querySelector('.main-content').classList.toggle('expanded');
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    elements.contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    elements.navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Show the selected section
    document.getElementById(`${sectionId}-section`).classList.add('active');
    
    // Add active class to the clicked nav item
    document.querySelector(`.nav-item[data-section="${sectionId}"]`).classList.add('active');
    
    // Update current section
    state.currentSection = sectionId;
}

// Show modal
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Show add item modal
function showAddItemModal() {
    showModal('add-item-modal');
}

// Show add department modal
function showAddDepartmentModal() {
    showModal('add-department-modal');
}

// Handle add item form submission
function handleAddItem(e) {
    e.preventDefault();
    
    const newItem = {
        id: document.getElementById('item-id').value,
        name: document.getElementById('item-name').value,
        category: document.getElementById('item-category').value,
        department: document.getElementById('item-department').value,
        quantity: parseInt(document.getElementById('item-quantity').value),
        unitCost: parseFloat(document.getElementById('item-unit-cost').value),
        location: document.getElementById('item-location').value,
        condition: document.getElementById('item-condition').value
    };
    
    state.inventory.push(newItem);
    
    // Update department item count
    const department = state.departments.find(dept => dept.name === newItem.department);
    if (department) {
        department.itemCount++;
    }
    
    // Reset form and close modal
    elements.addItemForm.reset();
    closeModal('add-item-modal');
    
    // Update UI
    renderInventoryTable();
    renderDepartmentsTable();
    updateDashboard();
    showNotification('Item added successfully!', 'success');
}

// Handle add department form submission
function handleAddDepartment(e) {
    e.preventDefault();
    
    const newDepartment = {
        id: state.departments.length + 1,
        name: document.getElementById('department-name').value,
        description: document.getElementById('department-description').value,
        itemCount: 0
    };
    
    state.departments.push(newDepartment);
    
    // Reset form and close modal
    elements.addDepartmentForm.reset();
    closeModal('add-department-modal');
    
    // Update UI
    renderDepartmentsTable();
    populateDepartmentFilters();
    updateDashboard();
    showNotification('Department added successfully!', 'success');
}

// Render inventory table
function renderInventoryTable() {
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    const filteredItems = filterInventoryItems();
    const paginatedItems = filteredItems.slice(startIndex, endIndex);
    
    elements.inventoryTableBody.innerHTML = '';
    
    if (paginatedItems.length === 0) {
        elements.inventoryTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center;">No items found</td>
            </tr>
        `;
        return;
    }
    
    paginatedItems.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.department}</td>
            <td>${item.quantity}</td>
            <td>$${item.unitCost.toFixed(2)}</td>
            <td><span class="badge ${getConditionClass(item.condition)}">${formatCondition(item.condition)}</span></td>
            <td>
                <button class="btn btn-sm btn-success"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem('${item.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        elements.inventoryTableBody.appendChild(row);
    });
    
    // Update pagination info
    updatePaginationInfo(filteredItems.length);
}

// Filter inventory items based on search and filters
function filterInventoryItems() {
    const searchTerm = elements.inventorySearch.value.toLowerCase();
    const departmentFilter = elements.departmentFilter.value;
    const categoryFilter = elements.categoryFilter.value;
    const conditionFilter = elements.conditionFilter.value;
    
    return state.inventory.filter(item => {
        const matchesSearch = item.id.toLowerCase().includes(searchTerm) || 
                             item.name.toLowerCase().includes(searchTerm);
        const matchesDepartment = departmentFilter === '' || item.department === departmentFilter;
        const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
        const matchesCondition = conditionFilter === '' || item.condition === conditionFilter;
        
        return matchesSearch && matchesDepartment && matchesCategory && matchesCondition;
    });
}

// Apply filters and re-render table
function filterInventory() {
    state.currentPage = 1;
    renderInventoryTable();
}

// Update pagination information
function updatePaginationInfo(totalItems) {
    const totalPages = Math.ceil(totalItems / state.itemsPerPage);
    elements.pageInfo.textContent = `Page ${state.currentPage} of ${totalPages}`;
    
    elements.prevPageBtn.disabled = state.currentPage === 1;
    elements.nextPageBtn.disabled = state.currentPage === totalPages || totalPages === 0;
}

// Go to previous page
function goToPrevPage() {
    if (state.currentPage > 1) {
        state.currentPage--;
        renderInventoryTable();
    }
}

// Go to next page
function goToNextPage() {
    const totalPages = Math.ceil(filterInventoryItems().length / state.itemsPerPage);
    if (state.currentPage < totalPages) {
        state.currentPage++;
        renderInventoryTable();
    }
}

// Render departments table
function renderDepartmentsTable() {
    elements.departmentsTableBody.innerHTML = '';
    
    state.departments.forEach(dept => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${dept.name}</td>
            <td>${dept.description}</td>
            <td>${dept.itemCount}</td>
            <td>
                <button class="btn btn-sm btn-success"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteDepartment(${dept.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        elements.departmentsTableBody.appendChild(row);
    });
}

// Populate department filters
function populateDepartmentFilters() {
    // Clear existing options
    elements.departmentFilter.innerHTML = '<option value="">All Departments</option>';
    elements.itemDepartment.innerHTML = '<option value="">Select Department</option>';
    
    // Add departments to filters
    state.departments.forEach(dept => {
        elements.departmentFilter.innerHTML += `<option value="${dept.name}">${dept.name}</option>`;
        elements.itemDepartment.innerHTML += `<option value="${dept.name}">${dept.name}</option>`;
    });
}

// Update dashboard with statistics
function updateDashboard() {
    // Update stats
    elements.totalItems.textContent = state.inventory.length;
    elements.totalDepartments.textContent = state.departments.length;
    elements.totalTransactions.textContent = state.transactions.length;
    
    // Calculate low stock items (quantity less than 5)
    const lowStockItems = state.inventory.filter(item => item.quantity < 5);
    elements.lowStockCount.textContent = lowStockItems.length;
    
    // Update recent transactions
    elements.recentTransactions.innerHTML = '';
    state.transactions.slice(0, 5).forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.item}</td>
            <td>${transaction.type}</td>
            <td>${transaction.quantity}</td>
            <td>${transaction.date}</td>
        `;
        elements.recentTransactions.appendChild(row);
    });
    
    // Update low stock alerts
    elements.lowStockAlerts.innerHTML = '';
    if (lowStockItems.length === 0) {
        elements.lowStockAlerts.innerHTML = '<p>No low stock items</p>';
    } else {
        lowStockItems.slice(0, 5).forEach(item => {
            const alert = document.createElement('div');
            alert.className = 'alert';
            alert.innerHTML = `
                <strong>${item.name}</strong> (${item.id}) - ${item.quantity} remaining
            `;
            elements.lowStockAlerts.appendChild(alert);
        });
    }
}

// Delete an item
function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        const itemIndex = state.inventory.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            const item = state.inventory[itemIndex];
            
            // Update department item count
            const department = state.departments.find(dept => dept.name === item.department);
            if (department && department.itemCount > 0) {
                department.itemCount--;
            }
            
            state.inventory.splice(itemIndex, 1);
            renderInventoryTable();
            renderDepartmentsTable();
            updateDashboard();
            showNotification('Item deleted successfully!', 'success');
        }
    }
}

// Delete a department
function deleteDepartment(deptId) {
    if (confirm('Are you sure you want to delete this department? All items in this department will be moved to "Unassigned".')) {
        const deptIndex = state.departments.findIndex(dept => dept.id === deptId);
        if (deptIndex !== -1) {
            const department = state.departments[deptIndex];
            
            // Move all items to "Unassigned"
            state.inventory.forEach(item => {
                if (item.department === department.name) {
                    item.department = 'Unassigned';
                }
            });
            
            state.departments.splice(deptIndex, 1);
            renderInventoryTable();
            renderDepartmentsTable();
            populateDepartmentFilters();
            updateDashboard();
            showNotification('Department deleted successfully!', 'success');
        }
    }
}

// Format condition for display
function formatCondition(condition) {
    switch (condition) {
        case 'new': return 'New';
        case 'good': return 'Good';
        case 'needs_repair': return 'Needs Repair';
        default: return condition;
    }
}

// Get CSS class for condition badge
function getConditionClass(condition) {
    switch (condition) {
        case 'new': return 'badge-success';
        case 'good': return 'badge-primary';
        case 'needs_repair': return 'badge-warning';
        default: return 'badge-secondary';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                min-width: 300px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                animation: slideIn 0.3s ease;
            }
            .notification-success { background-color: var(--success); }
            .notification-info { background-color: var(--info); }
            .notification-warning { background-color: var(--warning); }
            .notification-error { background-color: var(--danger); }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logout successful!', 'success');
        // Redirect to login page after logout
        window.location.href = 'login.html';
    }
}


// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);