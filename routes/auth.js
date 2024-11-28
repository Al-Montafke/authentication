router.post('/signup', async (req, res) => {
    try {
        // Your signup logic here
        // ...

        // On success
        res.redirect('/result?success=true&message=Account created successfully!');
    } catch (error) {
        // On failure
        res.redirect(`/result?success=false&message=${encodeURIComponent(error.message)}`);
    }
});

// Add the result page route
router.get('/result', (req, res) => {
    const success = req.query.success === 'true';
    const message = req.query.message || (success ? 'Operation successful!' : 'Something went wrong.');
    
    res.render('result', { success, message });
}); 