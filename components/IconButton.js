import React from "react";
import { Pressable } from "react-native";   
import styled from 'styled-components';
import { images } from "../src/image";
import PropTypes from 'prop-types';

const Icon = styled.Image`
 tint-color: ${({ theme, completed }) => completed ? theme.done : theme.text};
 width: 30px;
 height: 30px;
 margin: 10px;
 `;

 const IconButton = ({ type, onPressOut, id, completed }) => {
    const _onPressOut = () => {
        onPressOut(id);
    };

    return (
        <Pressable onPressOut={_onPressOut}>
            <Icon source={type} completed={completed} /*온프레스 아웃이 어디서 온건지 궁금하면 없애봐라 아 나중에 쓸거 미리 적은거네*/ />
        </Pressable> 
    );
 };

 IconButton.defaultProps = {
    onPressout: () => {},
 };

 IconButton.propTypes = {
    type: PropTypes.oneOf(Object.values(images)).isRequired,
    onPressOut: PropTypes.func, 
    id: PropTypes.string,
    completed: PropTypes.bool,
 }

 export default IconButton;