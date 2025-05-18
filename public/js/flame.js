console.log("flame.js が読み込まれました！");

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');

    const logout = document.querySelector('.logout_button');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        menu.classList.toggle('open');
    });

    logout.addEventListener('click', async function () {
        const response = await fetch('/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }, 
          body: JSON.stringify( {} )
        });

        if ( response.ok ) {
            const result = await response.json();
            console.log(result.message);
            location.href = '/';
        } else {
            console.error('Logout failed');
        }
    });
});

