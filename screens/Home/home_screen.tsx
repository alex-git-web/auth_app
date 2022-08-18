import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { colors } from '../../colors'
import { INavigationData } from '../../interfaces'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { setIsAuth } from '../../redux/user.slice'

const HomeScreen: React.FC<INavigationData> = props => {
  const isAuth = useSelector((state: RootState) => state.user.isAuth);
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(setIsAuth(false))
  }

  useEffect(() => {
    if (!isAuth) props.navigation.navigate("LogInScreen");
  }, [isAuth])

  if (isAuth) 
    return (
      <View style={styles.container}>
        <Text style={styles.caption}>Home Screen</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => logOut()}>
          <Text style={styles.logoutBtnText}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    )
  else return null
}

export default HomeScreen;

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
  logoutBtn: {
    width: 200,
    height: 50,
    backgroundColor: colors.lightBlue,
    textAlign: 'center',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },
  logoutBtnText: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '600'
  },
})