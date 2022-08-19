import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../../other/colors'
import { INavigationData } from '../../other/interfaces'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { setIsAuth } from '../../redux/user.slice'
import Snackbar from 'react-native-snackbar'
import ModalWindow from './components/modalWindow'

const HomeScreen: React.FC<INavigationData> = props => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [isDownloadingPosts, setIsDownloadingPosts] = useState<boolean>(false);
  const [posts, setPosts] = useState<any>(null);
  const [selectedPostId, setSelectedPostId] = useState<number>(-1);
  
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
        onPress: () => { actionFunc() },
      },
    });
  }

  const loadPostsFromServer = async () => {
    setIsDownloadingPosts(true)
   
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/')
      const json = await response.json()
      setPosts(json.filter((post: { id: number }) => post.id < 10))
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

  const postItem = (item : any) => {
    // console.log(item)
    return <TouchableOpacity onPress={() => setSelectedPostId(item.item.id)}>
            <View style={styles.postItem}>
              <Text style={styles.titlePost}>{item.item.title}</Text>
              <Text style={styles.bodyPost}>{item.item.body}</Text>
            </View>
          </TouchableOpacity>
  };

  const logOut = () => {
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
    marginTop: 15,
    paddingHorizontal: 10
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