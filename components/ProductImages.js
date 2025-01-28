import styled from "styled-components";
import { useState } from "react";

// Styled Components
const MainImageContainer = styled.div`
    width: 100%;
    max-width: 500px;
    aspect-ratio: 1 / 1; /* Fixed aspect ratio for consistent shape */
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 8px;
    background: #f9f9f9; /* Neutral background for empty spaces */
    border: 1px solid #ddd;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
`;

const MainImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain; /* Ensures proportional scaling within the box */
`;

const ThumbnailWrapper = styled.div`
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 10px;
`;

const Thumbnail = styled.img`
    ${props => props.active? `
        border-color: #ccc;
    `:`
        border-color: transparent;
    `}
    width: 60px;
    height: 60px;
    object-fit: contain;
    padding: 2px;
    border-radius: 4px;
    border: 2px solid transparent;
    cursor: pointer;
    transition: border 0.3s ease;

    &:hover {
        border: 2px solid #000;
    }


`;

// Component Function
export default function ProductImages({ images }) {
    const [selectedImage, setSelectedImage] = useState(images?.[0]);

    if (!images || images.length === 0) {
        return <p>No images available</p>;
    }

    return (
        <div>
            <MainImageContainer>
                <MainImage src={selectedImage} alt="Selected Product Image" />
            </MainImageContainer>
            <ThumbnailWrapper>
                {images.map((image, index) => (
                    <Thumbnail
                        key={index}
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => setSelectedImage(image)}
                        className={selectedImage === image ? "active" : ""}
                    />
                ))}
            </ThumbnailWrapper>
        </div>
    );
}
