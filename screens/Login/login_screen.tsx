import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../other/colors'
import { INavigationData } from '../../other/interfaces'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { setIsAuth } from '../../redux/user.slice'
import { registerdUsers } from '../../other/registeredUsers'
import { posts } from '../../other/posts';
import { comments } from '../../other/comments';


const LoginScreen: React.FC<INavigationData> = props => {
  const isAuth = useSelector((state: RootState) => state.user.isAuth);
  const dispatch = useDispatch();

  // const [isAuth, setIsAuth] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('kameil@gmail.com');
  const [password, setPassword] = useState<string>('Qwerty1234');

  const [errorText, setErrorText] = useState<string>('');
  const [isShowError, setIsShowError] = useState<boolean>(false);

  const validateEmail = () => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email)) {
      return true
    }
    else {
      setErrorText(error => error += 'Email is not correct. ')
      return false
    };
  };

  const validatePassword = () => {
    var minNumberofChars = 6;
    var maxNumberofChars = 16;
    var regularExpression  = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if(password.length < minNumberofChars || password.length > maxNumberofChars) {
      setErrorText(error => error += 'Password is not correct. ')
      return false;
    }
    if(!regularExpression.test(password)) {
      setErrorText(
        error => error 
        += "Password should contain atleast one number and one special character."
      );
      return false;
    }
    return true;
  }

  const clearError = () => {
    if (isShowError) setIsShowError(false)
    if (errorText != '') setErrorText('');
  }

  const emailEvent = (text : string) => {
    clearError()
    setEmail(text)
  }

  const passwordEvent = (text : string) => {
    clearError()
    setPassword(text)
  }

  const dataValidate = () => {
    clearError()
    const vEmail = validateEmail(); 
    const vPassword = validatePassword()

    if (!vEmail || !vPassword) setIsShowError(true)
    else {
      if (registerdUsers.find(user => user.email == email) && 
          registerdUsers.find(user => user.password == password)
      ) {
        dispatch(setIsAuth(
          {
            isAuth: true,
            data: {
              userName: registerdUsers.find(user => user.email == email)?.userName,
              email,
              password
            }
          }
        ))
      }
      else {
        setErrorText("This user in not registered!")
        setIsShowError(true)
      }
    }
  }
  
  const writeToFile = async () => {
    try {
      const en_posts = JSON.stringify(posts)
      await AsyncStorage.setItem('@posts', en_posts)

      const en_comments = JSON.stringify(comments)
      await AsyncStorage.setItem('@comments', en_comments)
    } catch (e) {
      console.log('An error occured while write to file (Async Storage): ', e)
    }
  }

  useEffect(() => {
    // Create and write file with default 'posts' and 'comments' data
    writeToFile()
  }, [])

  useEffect(() => {
    if (isAuth) props.navigation.navigate("HomeScreen");
  }, [isAuth])
  
  if (!isAuth)
    return (
      <View style={styles.container}>
        <Text style={styles.caption}>Login Screen</Text>
        <View style={styles.inputs_container}>
          <View style={styles.input}>
            <TextInput
              defaultValue={email}
              style={styles.email_input}
              placeholder="Enter email"
              placeholderTextColor={colors.black}
              onChangeText={(text) => emailEvent(text)}
            />
          </View>
          <View style={styles.input}>
            <TextInput
              defaultValue={password}
              style={styles.password_input}
              placeholder="Enter password"
              placeholderTextColor={colors.black}
              onChangeText={(text) => passwordEvent(text)}
              secureTextEntry
            />
          </View>
        </View>

        { email != '' && password != '' 
          ?
          <TouchableOpacity style={styles.loginBtn} onPress={() => dataValidate()}>
            <Text style={styles.loginBtnText}>
              Log In
            </Text>
          </TouchableOpacity>
          : null
        }
          <View style={styles.error}>
            <Text style={styles.error_text}>
              { isShowError ? errorText : '' }
            </Text>
          </View>
      </View>
    )
  else return null 
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      paddingHorizontal: 20,
      paddingVertical: 20,
      justifyContent: 'center',
      alignItems: 'center'
    },
    caption: {
      textAlign: 'center',
      color: colors.lightBlue,
      fontSize: 25
    },
    inputs_container: {
      width: '100%',
      alignItems: 'center',
      marginTop: 35
    },
    input: {
      height: 50, 
      width: '100%',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.lightGray,
      color: colors.black,
      fontSize: 15,
      paddingHorizontal: 15,
      marginBottom: 20
    },
    email_input: {
      fontSize: 15,
      color: colors.black
    },
    password_input: {
      fontSize: 15,
      color: colors.black
    },
    loginBtn: {
      width: 200,
      height: 50,
      backgroundColor: colors.lightBlue,
      textAlign: 'center',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10
    },
    loginBtnText: {
      fontSize: 15,
      color: colors.white,
      fontWeight: '600'
    },
    error: {
      width: 400,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40
    },
    error_text: {
      fontSize: 15,
      color: colors.lightRed
    },
    
})