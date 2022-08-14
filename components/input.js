import react from "react";  
import styled from "styled-components"; 
import { Dimensions } from "react-native";
import PropTypes from 'prop-types';


const StyledInput = styled.TextInput.attrs(({ theme }) => ({
   placeholderTextColor: theme.main,
}))
`width: ${({ width }) => width -40}px;
 height: 60px;
 margin: 3px 0;
 padding: 15px 20px;
 border-radius: 10px;
 background-color: ${({ theme}) => theme.itemBackground};
 font-size: 25px;
 color: ${({ theme }) => theme.text};
 `;

 const Input = ({ placeholder, value, onChangeText, onSubmitEditing, onBlur }) => {
    const width = Dimensions.get('window').width;

    return <StyledInput 
     width={width}
     placeholder={placeholder} 
     maxLength={50}
     autoCapitalize="none"
     autoCorrect={false}
     returnKeyType="done"
     keyboardAppearance="darlk"
     value={value}
     onChangeText={onChangeText}
     onSubmitEditing={onSubmitEditing}
     onBlur={onBlur}
      />
 };

 Input.propTypes = {
   onBlur: PropTypes.func.isRequired
 };



 export default Input;