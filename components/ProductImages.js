import React, { useRef, useState } from "react";
import styled from "styled-components";
import Image from "next/image";

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

// Remove MainImage styled.img, will use Next.js Image instead

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

// Remove Thumbnail styled.img, will use Next.js Image instead

const ZoomModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
// Remove ZoomModalImg styled.img, will use Next.js Image instead

export default function ProductImages({ images, selectedImage, onSelectImage }) {
    const [internalSelectedImage, setInternalSelectedImage] = useState(images?.[0]);
    const [zoomed, setZoomed] = useState(false);
    const scrollRef = useRef(null);
    const scrollIntervalRef = useRef();

    // Fade transition state
    const [fade, setFade] = useState(false);

    // Determine which image to show (controlled or internal)
    const imageToShow = selectedImage !== undefined ? selectedImage : internalSelectedImage;

    // When images prop changes, reset selected image
    React.useEffect(() => {
        if (images && images.length > 0) {
            if (onSelectImage) {
                onSelectImage(images[0]);
            } else {
                setInternalSelectedImage(images[0]);
            }
            setFade(true);
            setTimeout(() => setFade(false), 250);
        }
    }, [images]);

    const startScroll = (direction) => {
        if (scrollRef.current) {
            scrollIntervalRef.current = setInterval(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollLeft += direction === "right" ? 20 : -20;
                }
            }, 50);
        }
    };

    const stopScroll = () => {
        clearInterval(scrollIntervalRef.current);
    };

    React.useEffect(() => {
        return () => clearInterval(scrollIntervalRef.current);
    }, []);

    if (!images || images.length === 0) {
        return <p>No images available</p>;
    }

    return (
        <div>
            <MainImageContainer
                onClick={() => setZoomed(true)}
                style={{ cursor: 'zoom-in', position: 'relative' }}
            >
                {imageToShow && (
                  <Image
                    src={imageToShow}
                    alt="Selected Product Image"
                    width={500}
                    height={500}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      opacity: fade ? 0 : 1,
                      transition: 'opacity 0.25s',
                      position: 'relative',
                      zIndex: 2,
                    }}
                    priority={false}
                  />
                )}
            </MainImageContainer>
            {zoomed && (
              <ZoomModalOverlay onClick={() => setZoomed(false)}>
                {imageToShow && (
                  <Image
                    src={imageToShow}
                    alt="Zoomed Product"
                    width={900}
                    height={900}
                    style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '12px', boxShadow: '0 8px 32px rgba(44,62,80,0.18)' }}
                  />
                )}
              </ZoomModalOverlay>
            )}
            <ThumbnailContainer>
                <ScrollZone left onMouseEnter={() => startScroll("left")} onMouseLeave={stopScroll} />
                <ScrollableWrapper ref={scrollRef}>
                    {images.map((image, index) => (
                        <div
                          key={index}
                          style={{ border: imageToShow === image ? '2px solid #ff9900' : '2px solid transparent', borderRadius: 4, padding: 2, cursor: 'pointer', width: 60, height: 60 }}
                          onClick={() => {
                            if (onSelectImage) {
                              onSelectImage(image);
                            } else {
                              setInternalSelectedImage(image);
                            }
                            setFade(true);
                            setTimeout(() => setFade(false), 250);
                          }}
                        >
                          <Image
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            width={60}
                            height={60}
                            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                          />
                        </div>
                    ))}
                </ScrollableWrapper>
                <ScrollZone onMouseEnter={() => startScroll("right")} onMouseLeave={stopScroll} />
            </ThumbnailContainer>
        </div>
    );
}
