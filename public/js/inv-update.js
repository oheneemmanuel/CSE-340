const form = document.querySelector("#updateForm")
form.addEventListener("change", function () {
    const updateBnt = document.querySelector("#updateBtn")
    updateBnt.removeAttribute("disabled")
});