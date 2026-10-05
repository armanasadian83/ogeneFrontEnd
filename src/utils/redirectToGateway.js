export function redirectToGateway(paymentUrl, token) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = paymentUrl;
    form.style.display = "none";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "Token";
    input.value = token;
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();
}