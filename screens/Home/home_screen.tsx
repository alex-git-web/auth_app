import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { colors } from '../../other/colors'
import { INavigationData } from '../../other/interfaces'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { setIsAuth } from '../../redux/user.slice'

const HomeScreen: React.FC<INavigationData> = props => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(setIsAuth(
      {
        isAuth: false,
        data: {
          userName: '',
          email : '',
          password : ''
        }
      }
    ))
  }

  useEffect(() => {
    if (!user.isAuth) props.navigation.navigate("LogInScreen");
  }, [user.isAuth])

  if (user.isAuth) 
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.caption}>Home Screen</Text>

          <TouchableOpacity style={styles.logoutBtn} onPress={() => logOut()}>
            <Text style={styles.logoutBtnText}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <Text style={styles.welcome}>Hi, { user.data.userName }! </Text>
        </View>
      </View>
    )
  else return null
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  header: {
    backgroundColor: colors.lightBlue_2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  caption: {
    textAlign: 'center',
    color: colors.lightBlue,
    fontSize: 25
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  welcome: {
    textAlign: 'center',
    color: colors.lightBlue,
    fontSize: 20,
    marginTop: 30
  },
  logoutBtn: {
    width: 100,
    height: 50,
    backgroundColor: colors.lightBlue,
    textAlign: 'center',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '600'
  },
})