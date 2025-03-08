let loginSignupButton = document.querySelector(".navigation_button_signin_signup");
let logoutButton = document.querySelector(".navigation_button_signout");

//Get current login user information

async function getUserData() {
    try {
        let token = localStorage.getItem('token');
        if (!token) {
            loginSignupButton.style.display = "flex";
            logoutButton.style.display = "none";
            return false;
        }

        const response = await fetch('https://taipeitrips.com/api/user/auth', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        let responseData = await response.json();
        
        if (responseData.data === null) {
            loginSignupButton.style.display = "flex";
            logoutButton.style.display = "none"; 
            return false;
        }

        if (responseData.data) {
            let id = responseData.data.id; //get member info
            let name = responseData.data.name;
            let account = responseData.data.email;
            loginSignupButton.style.display = "none";
            logoutButton.style.display = "flex";
            return { "id": id, "name": name, "account": account };
        }
    } catch (error) {
        console.error('getUserData() error occurred:', error.message);
        return false;
    }
}

export {getUserData}