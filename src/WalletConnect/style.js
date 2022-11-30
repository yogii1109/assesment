import styled from 'styled-components';

export const Container = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

export const Button = styled.button`
background:green;
margin:10px auto;
color:white;
border:none;
padding:15px;
cursor:pointer;
transition:transform 0.2s;
&:active{
    transform:translateY(2px);
}
`

export const Data = styled.div`
margin:10px auto;
`

export const Span = styled.div`
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;

`