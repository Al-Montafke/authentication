const express = require('express');
const cookieParser = require('cookie-parser');
const marked = require('marked');
const createDOMPurify = require('dompurify');
const { get_image } = require('./get-image');
const { JSDOM } = require('jsdom');
const dompurify = createDOMPurify(new JSDOM().window);
const sanitize = require('sanitize-html');
const jwt = require('jsonwebtoken');
const { send_email } = require('./send-mail');
const { get_user_token } = require('./user-mw');
const { create_user, get_user, update_user, update_user_theme, update_user_logo } = require('./create-user');
const { hash_password, compare_password } = require('./javascripts/hash-val');
const fs = require('fs');
const path = require('path');

const app = express();
const dotenv = require('dotenv');
const port = 3000;

dotenv.config();
const window = new JSDOM('').window;
const DOMPurify = dompurify(window);
const jwt_secret = process.env.SECRET;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(__dirname));
app.use(express.static('style'));
app.set('view engine', 'ejs');
app.use('/images', express.static(__dirname + '/images', {
    maxAge: '1d'
}));
app.use('/javascripts', express.static(__dirname + '/javascripts'));

app.use((err, req, res, next) => {
    if (err instanceof PayloadTooLargeError) {
        return res.status(413).json({ success: false, message: 'Payload too large' });
    }
    next(err);
});

app.get('/', (req, res) => {
    res.send("Hello world");
});

app.get('/login', (req, res) => {
    res.render('login', { page: 'login' });
});

app.get('/signup', (req, res) => {
    res.render('signup', { page: 'signup' });
});

app.get('/user/:username/home', get_user_token, async (req, res) => {
    const { username } = req.params;
    const user = await get_user(username);
    if (!user) return res.render('result', { success: false, page: 'home', message: 'User not found' });
    const sanitized = sanitize(marked.parse(user.customization.about));
    res.render('home', { 
        username: user.username, 
        content: sanitized, 
        theme: user.customization.theme || 'light',
        logo: user.customization.logo
    });
});
 
app.get('/callback', (req, res) => {
    res.send('Callback received');
});

app.get('/user/:username/home/edit', get_user_token, async (req, res) => {
    const { username } = req.params;
    const user = await get_user(username);
    if (!user) return res.render('result', { success: false, page: 'edit', message: 'User not found' });
    const about = user.customization.about;
    const sanitized = DOMPurify.sanitize(marked.parse(about));
    res.render('edit-about', { username: username, content: sanitized, theme: user.customization.theme || 'light' });
});

app.get('/logout', (req, res) => {
    res.render('logout');
});

app.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.status(200).json({ success: true });
});

app.post('/signup', async (req, res) => { 
    try {
        console.log('Received signup request:', req.body);
        const { username, email, password, confirmPassword } = req.body;
        
        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            return res.render('result', { success: false, page: 'signup', message: 'All fields are required' });
        }
        
        if (password !== confirmPassword) {
            return res.render('result', { success: false, page: 'signup', message: 'Passwords do not match' });
        }

        try {
            const hashed = await hash_password(password, 10);
            console.log(`Hashed IN main.js: ${hashed}`);
            if (hashed) {
                const new_user = await create_user(username, email, hashed);
                if (new_user) {
                    return res.render('result', { success: true, page: 'login', message: 'Signup successful! Redirecting to login...' });
                }
            }
        } catch (err) {
            console.error('Error hashing password:', err);
            return res.render('result', { success: false, message: 'Internal server error' });
        }

        res.render('result', { success: true, page: 'login', message: 'Signup successful! Redirecting to login...' });
    } catch (error) {
        console.error('Signup error:', error);
        res.render('result', { success: false, page: 'signup', message: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    const { name, password } = req.body;

    const user = await get_user(name);

    if (!user) return res.render('result', { success: false, page: 'login', message: 'User not found' });

    const is_match = await compare_password(password, user.password);

    if (!is_match) return res.render('result', { success: false, page: 'login', message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, jwt_secret, { expiresIn: '5h' });

    // Set the cookie first
    res.cookie('token', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        path: '/'  // Add explicit path
    });
    
    res.cookie('theme', user.customization.theme || 'light', { 
        httpOnly: false,  // Change to false so JavaScript can access it
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        path: '/'  // Add explicit path
    });
    // Then render the response
    res.render('result', { success: true, page: 'home', message: 'Login successful! Redirecting to home...', token: token });
});

app.post('/api/edit-about', get_user_token, async (req, res) => {
    try {
        // Get the content from the request body
        const { content } = req.body;

        console.log(`Text: ${content}`);

        const username = req.username;
        console.log(`User: ${username}`);

        const update = await update_user(username, content);

        console.log(`Update: ${update}`);

        if (update.acknowledged) return res.json({ success: true, message: 'Content updated successfully' });
        return res.status(400).json({ success: false, message: 'Failed to update content' });

    } catch (error) {
        console.error('Error saving content:', error);
        res.status(500).json({ success: false, message: 'Failed to save content' });
    }
});

app.post('/api/save-theme', get_user_token, async (req, res) => {
    try {
        const { theme } = req.body;
        const username = req.username;
        
        const update = await update_user_theme(username, theme);
        
        if (update.acknowledged) {
            res.cookie('theme', theme, { 
                httpOnly: false,  // Change to false
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/'  // Add explicit path
            });
            return res.json({ success: true, message: 'Theme updated successfully' });
        }
        return res.status(400).json({ success: false, message: 'Failed to update theme' });
    } catch (error) {
        console.error('Error saving theme:', error);
        res.status(500).json({ success: false });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.post('/user/:username/home/contact', async (req, res) => {
    const { username } = req.params;
    const { email, message } = req.body;

    if (!email || !message) return res.status(400).json({ success: false, message: 'Error, failed to provide all fields' });

    const mail = await send_email(email, process.env.email_address, `${username} - Contact Form`, message);

    console.log(`Mail: ${mail}`);
    if (mail) return res.status(200).json({ success: true, message: 'Message sent successfully' });
    return res.status(400).json({ success: false, message: 'Failed to send message' });
})

app.post('/user/:username/images', async (req, res) => {
    const { username } = req.params;
    const { img, filename } = req.body;
    const user = await get_user(username);
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });
    if (!img || !filename) return res.status(400).json({ success: false, message: 'Error, failed to provide all fields' });

    const sanitized_filename = sanitize(filename);
    const img_dir = path.join(__dirname, 'images', username);
    const img_path = path.join(img_dir, sanitized_filename);

    if (!fs.existsSync(img_dir)) {
        fs.mkdirSync(img_dir, { recursive: true });
    }

    const base64_data = await img.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
    fs.writeFile(img_path, base64_data, 'base64', async (err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Failed to save image' });
        }
        const url = await get_image(username, filename);

        const update_path = await update_user_logo(username, url);
        
        if (!update_path.acknowledged) return res.status(400).json({ success: false, message: 'Failed to update user logo' });
        res.cookie('logo', url, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        res.json({
            success: true,
            message: 'Image saved successfully',
            link: url
        });
    });
})

app.get('/user/:username/images/:img', async (req, res) => {
    const { username, img } = req.params;
    const img_path = path.join(__dirname, 'images', username, img);
    
    if (!fs.existsSync(img_path)) {
        return res.status(404).json({ success: false, message: 'Image not found' });
    }
    res.sendFile(img_path);
});