const fs = require('fs');
const https = require('https');
const path = require('path');

const downloadImage = (url, filepath) => new Promise((resolve, reject) => {
    https.get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
            return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
        }
        const stream = fs.createWriteStream(filepath);
        res.pipe(stream);
        stream.on('finish', () => {
            stream.close();
            resolve();
        });
        stream.on('error', reject);
    }).on('error', reject);
});

(async () => {
    try {
        console.log('Fetching database to gather filenames...');
        const placeholderUrl = 'https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.jpg';
        const defaultPath = path.join(__dirname, 'public/uploads/default.jpg');
        
        await downloadImage(placeholderUrl, defaultPath);
        console.log('Default high-quality placeholder downloaded.');

        const fetchJson = async (url) => {
            return new Promise((resolve, reject) => {
                https.get(url, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => resolve(JSON.parse(data)));
                }).on('error', reject);
            });
        };

        const servicesRes = await fetchJson('https://joker-hm0k.onrender.com/api/services');
        const categoriesRes = await fetchJson('https://joker-hm0k.onrender.com/api/categories?status=Active');
        const usersRes = await fetchJson('https://joker-hm0k.onrender.com/api/users/get_users');
        
        const services = servicesRes.data || [];
        const categories = categoriesRes.data || [];
        const users = usersRes.data || [];

        let files = new Set();
        
        services.forEach(s => {
            if(s.image && s.image.includes('.')) files.add(s.image);
            if(s.gallery) {
                s.gallery.forEach(g => {
                    if (typeof g === 'string' && g.includes('.')) files.add(g);
                    else if (g && g.image_url && g.image_url.includes('.')) files.add(g.image_url);
                });
            }
        });

        categories.forEach(c => {
            if(c.image && c.image.includes('.')) files.add(c.image);
        });

        users.forEach(u => {
            if(u.profile_image && u.profile_image.includes('.')) files.add(u.profile_image);
        });

        console.log('Extracted ' + files.size + ' filenames.');
        
        for (let file of files) {
            file = String(file).trim();
            if (!file.includes('/')) {
                const target = path.join(__dirname, 'public/uploads', file);
                try {
                    fs.copyFileSync(defaultPath, target);
                } catch(err) {
                    console.log('Failed to copy ' + file);
                }
            }
        }
        
        console.log('Successfully hydrated the uploads folder with actual db filenames!');
    } catch(e) {
        console.error(e);
    }
})();
