import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import NetInfo from "@react-native-community/netinfo";
import { colors } from '../../other/colors'
import { INavigationData } from '../../other/interfaces'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { setIsAuth } from '../../redux/user.slice'
import Snackbar from 'react-native-snackbar'
import ModalWindow from './components/modalWindow'
import AsyncStorage from '@react-native-async-storage/async-storage';

let unsubscribe: any;

const HomeScreen: React.FC<INavigationData> = props => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [internetStatus, setInternetStatus] = useState<{isShowNotify: boolean, isInternet: boolean | any}>(
    {
      isShowNotify: false,
      isInternet: false
    }
  );
  const [isDownloadingPosts, setIsDownloadingPosts] = useState<boolean>(false);
  const [posts, setPosts] = useState<any>(null);
  const [selectedPostId, setSelectedPostId] = useState<number>(-1);
  
  const readFromFile = async (storageKey: string) => {
    try {
      const de_posts: any = await AsyncStorage.getItem('@' + storageKey)
      de_posts != null ? JSON.parse(de_posts) : null;
      return await JSON.parse(de_posts)
    } catch(e) {
      console.log('An error occured while read from file (Async Storage): ', e)
    }
  }

  const showSnackbar = (msg: string, actionText: string, actionFunc: Function) => {
    setIsDownloadingPosts(false)
    Snackbar.show({
      text: msg,
      backgroundColor: colors.black,
      textColor: colors.white,
      duration: Snackbar.LENGTH_SHORT,
      action: {
        text: actionText,
        textColor: colors.lightGreen,
        onPress: () => actionFunc(),
      },
    });
  }

  const loadPostsFromServer = async () => {
    if (internetStatus.isInternet) {
      setIsDownloadingPosts(true)
    
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/')
        const json = await response.json()
        const res_posts = json.filter((post: { id: number }) => post.id < 5)

        // Save 'posts' in local
        try {
          const en_posts = JSON.stringify(res_posts)
          await AsyncStorage.setItem('@posts', en_posts)
        } catch (e) {
          console.log('An error occured while write to file (Async Storage): ', e)
        }

        setPosts(res_posts)
      } 
      catch (error) {
        console.error(error);
        showSnackbar(
          'An error occured in while downloading \'posts\'. ',
          'Try again',
          loadPostsFromServer
        )
      }
    }
    else {
      setPosts(await readFromFile('posts'))
    }
  }

  const postItem = (item : any) => {
    return <TouchableOpacity onPress={() => setSelectedPostId(item.item.id)}>
            <View style={styles.postItem}>
              <Text style={styles.titlePost}>{item.item.title}</Text>
              <Text style={styles.bodyPost}>{item.item.body}</Text>
            </View>
          </TouchableOpacity>
  };

  const logOut = () => {
    unsubscribe() // remove check Internet status listener
    setPosts(null)
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
    // Set Internet status listener
    unsubscribe = NetInfo.addEventListener(state => {
      setInternetStatus(
        {
          isShowNotify: !state.isConnected ? true : false,
          isInternet: state.isConnected,
        }
      );
    });
  }, [])

  useEffect(() => {
    if (!user.isAuth) props.navigation.navigate("LogInScreen");
    if (posts != null) setIsDownloadingPosts(false);
  }, [user.isAuth, posts])

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
          {
            internetStatus.isShowNotify
            ?
            <View style={styles.isEnternetNotifity}>
              <Text style={styles.isEnternetNotifity_text}>Not connection with Internet!</Text>
            </View>
            : null
          }

          <Text style={styles.welcome}>Hi, { user.data.userName }! </Text>

          <TouchableOpacity style={styles.loadPosts} onPress={() => loadPostsFromServer()}>
            <Text style={styles.loadPostsText}>
              Load 'posts' from server
            </Text>
          </TouchableOpacity>

          {
            isDownloadingPosts 
            ? 
            <View style={{marginVertical: 20}}>
              <ActivityIndicator size={30} color={colors.lightBlue} />
            </View>
            : null
          }

          {
            posts != null
            ?
            <View style={styles.postsList}>
              <FlatList
                data={posts}
                renderItem={postItem}
                keyExtractor={item => item.id}
              />
            </View>
            : null
          }
        </View>

        {
          selectedPostId != -1
          ? <ModalWindow  
              postId={selectedPostId} 
              showSnackbar={showSnackbar} 
              setSelectedPostId={setSelectedPostId}
              isInternet={internetStatus.isInternet}
              readFromFile={readFromFile}
            />
          : null
        }
      </View>
    )
  else return null
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  header: {
    height: 70,
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
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  isEnternetNotifity: {
    backgroundColor: colors.lightGray_2,
    marginBottom: 30,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  isEnternetNotifity_text: {
    color: colors.lightRed,
    fontSize: 20,
    fontWeight: '600'
  },
  welcome: {
    textAlign: 'center',
    color: colors.lightBlue,
    fontSize: 20,
    marginTop: 10
  },
  logoutBtn: {
    height: 50,
    backgroundColor: colors.lightBlue,
    textAlign: 'center',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  logoutBtnText: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '600'
  },
  loadPosts: {
    height: 50,
    backgroundColor: colors.lightBlue,
    textAlign: 'center',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20
  },
  loadPostsText: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '600'
  },
  /* Posts list */
  postsList: {
    backgroundColor: colors.lightBlue_2,
    height: '60%',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  postItem: {
    backgroundColor: colors.white,
    marginBottom: 20
  },
  titlePost: {
    fontSize: 15,
    color: colors.black,
    fontWeight: '500',
    marginBottom: 10
  },
  bodyPost: {
    fontSize: 15,
    color: colors.lightGray,
    fontWeight: '400'
  },
})