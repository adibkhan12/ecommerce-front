export default function BarsIcon({className = ""}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white"
             className={`w-6 h-6 ${className}`} style={{ display: "block", width: "24px", height: "24px", minWidth: "24px", minHeight: "24px" }}> {/* <-- Force it to render */}
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
        </svg>
    );
}
