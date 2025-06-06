import styled from "styled-components";

const StyledDiv = styled.div`
max-width: 1400px;
margin: 0 auto;
padding: 0 20px;
`;

export default function Center({children}) {
    return (
        <StyledDiv>
            {children}
        </StyledDiv>
    );
}