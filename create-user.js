const { connect } = require('./javascripts/connectdb');

let client;

(async function() {
    client = await connect();
    return client;
})();

async function create_user(username, email, password) {
    const db = client.db('users');
    const collection = db.collection('user');

    if (collection) {
        console.log('Collection found!');
        try {
            const new_user = await collection.insertOne({
                username: username,
                email: email,
                password: password,
                customization: {
                    about: '',
                    theme: 'light',
                    logo: ''
                }
            });
            return new_user;
        } catch (err) {
            console.error('Error inserting user:', err);
        }

    }
    else throw new Error('Collection not found!');

}

async function get_user(index) {
    const db = client.db('users');
    const collection = db.collection('user');

    try {
        const user_email = await collection.findOne({ email: index });
        if (user_email) return user_email;

        console.log('User not found! Trying username...');
        const user_username = await collection.findOne({ username: index });
        if (user_username) {
            console.log(`User found: ${user_username}`);
            return user_username;
        }

        throw new Error('User not found!');
    } catch (err) {
        console.error('Error getting user:', err);
        throw err;
    }
}

async function update_user(username, content) {
    const db = client.db('users');
    const collection = db.collection('user');

    const update_user = await collection.updateOne({ username: username }, { $set: { "customization.about": content } });
    return update_user;
}

async function update_user_theme(username, theme) {
    const db = client.db('users');
    const collection = db.collection('user');

    const update_user_theme = await collection.updateOne(
        { username: username }, 
        { $set: { "customization.theme": theme } 
    });
    return update_user_theme;
}

async function update_user_logo(username, logo) {
    const db = client.db('users');
    const collection = db.collection('user');

    const update_user_logo = await collection.updateOne(
        { username: username},
        { $set: { "customization.logo": logo }
    });
    return update_user_logo;
}

module.exports = { create_user, get_user, update_user, update_user_theme, update_user_logo };

