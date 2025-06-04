import styled from "styled-components";
import {useRef, useState} from "react";

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

const ThumbnailContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    max-width: 400px; /* Max width constraint (Red Box) */
    overflow: hidden;
`;

const ScrollableWrapper = styled.div`
    display: flex;
    overflow-x: auto;
    scroll-behavior: smooth;
    gap: 10px;
    padding: 5px;
    width: 300px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const ScrollZone = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    width: 30px;
    background: transparent;
    cursor: pointer;
    z-index: 10;
    ${props => props.left ? `left: 0;` : `right: 0;`}
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

const ZoomModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ZoomModalImg = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(44,62,80,0.18);
`;

export default function ProductImages({ images }) {
    const [selectedImage, setSelectedImage] = useState(images?.[0]);
    const [zoomed, setZoomed] = useState(false);
    const scrollRef = useRef(null);
    let scrollInterval;

    const startScroll = (direction) => {
        if (scrollRef.current) {
            scrollInterval = setInterval(() => {
                scrollRef.current.scrollLeft += direction === "right" ? 20 : -20;
            }, 50);
        }
    };

    const stopScroll = () => {
        clearInterval(scrollInterval);
    };

    if (!images || images.length === 0) {
        return <p>No images available</p>;
    }

    return (
        <div>
            <MainImageContainer onClick={() => setZoomed(true)} style={{ cursor: 'zoom-in' }}>
                <MainImage src={selectedImage} alt="Selected Product Image" />
            </MainImageContainer>
            {zoomed && (
              <ZoomModalOverlay onClick={() => setZoomed(false)}>
                <ZoomModalImg src={selectedImage} alt="Zoomed Product" />
              </ZoomModalOverlay>
            )}
            <ThumbnailContainer>
                <ScrollZone left onMouseEnter={() => startScroll("left")} onMouseLeave={stopScroll} />
                <ScrollableWrapper ref={scrollRef}>
                    {images.map((image, index) => (
                        <Thumbnail
                            key={index}
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            onClick={() => setSelectedImage(image)}
                            active={selectedImage === image}
                        />
                    ))}
                </ScrollableWrapper>
                <ScrollZone onMouseEnter={() => startScroll("right")} onMouseLeave={stopScroll} />
            </ThumbnailContainer>
        </div>
    );
}
