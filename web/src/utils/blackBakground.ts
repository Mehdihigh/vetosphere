export function printBlackBackground(onClose: () => void): void {
    const existingDiv = document.getElementById("blackDiv");
    if (existingDiv) {
        existingDiv.remove();
    }

    const blackDiv = document.createElement("div");
    blackDiv.classList.add(
        "bg-black",
        "opacity-50",
        "top-0",
        "left-0",
        "z-10",
        "w-full",
        "h-full",
        "fixed",
        "p-2"
    );

    blackDiv.id = "blackDiv";
    document.body.appendChild(blackDiv);
    blackDiv.style.display = "block";

    blackDiv.onclick = () => {
        onClose();
    };
}

export function removeBlackBackground(): void {
    const blackDiv = document.getElementById("blackDiv");
    if (blackDiv) {
        blackDiv.remove();
    }
}
