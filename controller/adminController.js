// const adminModel = require('../model/adminModel');
// const bcrypt = require('bcrypt');
// const userModel = require('../model/userModel');

// // Load login page
// const loadLogin = async (req, res) => {
//     res.render('admin/login');
// };

// // Admin login logic
// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const admin = await adminModel.findOne({ email });

//         if (!admin) return res.render('admin/login', { message: 'Invalid credentials' });

//         const isMatch = await bcrypt.compare(password, admin.password);

//         if (!isMatch) return res.render('admin/login', { message: 'Invalid credentials' });

//         req.session.admin = true;

//         res.redirect('/admin/dashboard');
//     } catch (error) {
//         res.send(error);
//     }
// };




// // Edit user details
// const editUser = async (req, res) => {
//     try {
//         const { email, password, id } = req.body;

//         const hashedPassword = await bcrypt.hash(password, 10);

//         await userModel.findOneAndUpdate({ _id: id }, { $set: { email, password: hashedPassword } });

//         res.redirect('/admin/dashboard');
//     } catch (error) {
//         console.log(error);
//     }
// };

// // Delete user
// const deleteUser = async (req, res) => {
//     try {
//         const { id } = req.params;

//         await userModel.findOneAndDelete({ _id: id });

//         res.redirect('/admin/dashboard');
//     } catch (error) {
//         console.log(error);
//     }
// };

// // Add a new user
// // const addUser = async (req, res) => {
// //     try {
// //         const { email, password } = req.body;

// //         const hashedPassword = await bcrypt.hash(password, 10);

// //         const newUser = new userModel({
// //             email,
// //             password: hashedPassword
// //         });

// //         await newUser.save();

// //         res.redirect('/admin/dashboard');
// //     } catch (error) {
// //         console.log(error);
// //     }
// // };
// // Add a new user with email existence check
// const addUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Check if a user with the same email already exists
//         const existingUser = await userModel.findOne({ email });
//         if (existingUser) {
//             // Fetch all users and send them to the dashboard
//             const users = await userModel.find({});

//             // If email exists, return a message and prevent adding the user
//             return res.render('admin/dashboard', { 
//                 message: 'Email already exists', 
//                 users,  // Pass the current list of users
//                 searchQuery: '' 
//             });
//         }

//         // If email doesn't exist, proceed to hash the password and save the new user
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = new userModel({
//             email,
//             password: hashedPassword
//         });

//         await newUser.save();

//         // Redirect to the dashboard after successful user addition
//         res.redirect('/admin/dashboard');
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Server Error');
//     }
// };


// // Admin logout
// const logout = async (req, res) => {
//     req.session.admin = null;
//     res.redirect('/admin/login');
// };

// //module.exports = { loadLogin, login, loadDashboard, editUser, deleteUser, addUser, logout };
// //------------------------------------------------------------------------------------------------


// // Load dashboard with user search functionality
// const loadDashboard = async (req, res) => {
//     try {
//         const searchQuery = req.query.query || ''; // Capture search input
//         let users;

//         if (searchQuery) {
//             // Search for users matching the query (case-insensitive)
//             users = await userModel.find({ email: new RegExp(searchQuery, 'i') });
//         } else {
//             // If no search query, return all users
//             users = await userModel.find({});
//         }

//         res.render('admin/dashboard', { users, searchQuery }); // Send data to the view
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// };

// // Handle search results
// const searchAdminUsers = async (req, res) => {
//     try {
//         const searchTerm = req.query.q; // Query param for search term
//         const searchResults = await userModel.find({
//             email: { $regex: searchTerm, $options: 'i' } // Case-insensitive search
//         });
        
//         res.render('admin/dashboard', { users: searchResults, searchQuery: searchTerm });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// };

// module.exports = { loadLogin, login, loadDashboard, searchAdminUsers, editUser, deleteUser, addUser, logout };








const adminModel = require('../model/adminModel'); 
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');

// Load login page
const loadLogin = async (req, res) => {
    res.render('admin/login');
};

// Admin login logic
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await adminModel.findOne({ email });

        if (!admin) return res.render('admin/login', { message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) return res.render('admin/login', { message: 'Invalid credentials' });

        req.session.admin = true;

        res.redirect('/admin/dashboard');
    } catch (error) {
        res.send(error);
    }
};

// Edit user details
const editUser = async (req, res) => {
    const { id, email, password } = req.body;

    // Check if the new email already exists (excluding the current user being edited)
    const existingUser = await userModel.findOne({ email, _id: { $ne: id } });

    if (existingUser) {
        // If the email exists, return the dashboard with an error message
        return res.render('admin/dashboard', {
            users: await userModel.find(),
            message: 'Email already exists. Please choose a different email.',
            searchQuery: req.query.q || '',
        });
    }

    // Proceed to hash the password if it is updated
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    // Update user details
    await userModel.findByIdAndUpdate(id, {
        email,
        ...(hashedPassword && { password: hashedPassword }), // Only update password if provided
    });

    res.redirect('/admin/dashboard'); // Redirect back to the dashboard after editing
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await userModel.findOneAndDelete({ _id: id });

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
    }
};

// Add a new user with email existence check
const addUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if a user with the same email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            // If email exists, return a message and prevent adding the user
            return res.render('admin/dashboard', { 
                message: 'Email already exists', 
                users: await userModel.find(), // Fetch all users to display
                searchQuery: '' 
            });
        }

        // If email doesn't exist, proceed to hash the password and save the new user
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Redirect to the dashboard after successful user addition
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

// Admin logout
const logout = async (req, res) => {
    req.session.admin = null;
    res.redirect('/admin/login');
};

// Load dashboard with user search functionality
const loadDashboard = async (req, res) => {
    try {
        const searchQuery = req.query.query || ''; // Capture search input
        let users;

        if (searchQuery) {
            // Search for users matching the query (case-insensitive)
            users = await userModel.find({ email: new RegExp(searchQuery, 'i') });
        } else {
            // If no search query, return all users
            users = await userModel.find({});
        }

        res.render('admin/dashboard', { users, searchQuery }); // Send data to the view
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Handle search results
const searchAdminUsers = async (req, res) => {
    try {
        const searchTerm = req.query.q; // Query param for search term
        const searchResults = await userModel.find({
            email: { $regex: searchTerm, $options: 'i' } // Case-insensitive search
        });
        
        res.render('admin/dashboard', { users: searchResults, searchQuery: searchTerm });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

module.exports = { loadLogin, login, loadDashboard, searchAdminUsers, editUser, deleteUser, addUser, logout };
