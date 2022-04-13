window.onload = () => {
    const navItem = document.querySelector(".nav-item.dropdown");
    const amountItem = document.querySelector("#dropdown__cart--amount");

    navItem.addEventListener("click", async() => {
        console.log(navItem);

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({ count: "1" }),

        }
        try {
            const resJson = await fetch('/count', options);
            const { status, amount } = await resJson.json();
            if (status == "success") {

                amountItem.innerText = amount;
            }
        } catch (e) {
            console.error("error for amount of item in cart: ", e);
        }
    })
}