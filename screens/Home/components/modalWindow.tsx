import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, ScrollView, TouchableWithoutFeedback, FlatList, ActivityIndicator } from "react-native";
import { colors } from "../../../other/colors";

const ModalWindow: React.FC<{
    postId: number, 
    showSnackbar: Function
    setSelectedPostId: any,
    isInternet: boolean,
    readFromFile: Function
}> = props => {
    const [isDownloadingComments, setIsDownloadingComments] = useState<boolean>(false);
    const [postComments, setPostComments] = useState<any>(null); 

    const hideModalWindow = () => {
        props.setSelectedPostId(-1)
    }
    
    const downloadPostComments = async ()  => {
        if (props.isInternet) {
            setIsDownloadingComments(true)
            
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts/'+ props.postId +'/comments')
                const json = await response.json()

                setPostComments(json)
            } 
            catch (error) {
                console.error(error);
                props.showSnackbar(
                    'An error occured in while downloading \'comments for post.\'. ',
                    'OK',
                    null
                );
                setTimeout(() => hideModalWindow(), 1000) 
            }
        }
        else {
            let res = await props.readFromFile('comments');
            setPostComments(
                res.filter((comment: any) => comment.postId === props.postId)
            )
        }
    }
    const commentItem = (item: any) => {
        return <View style={styles.commentItem}>
                    <Text style={styles.commentCaption}>PostId: </Text><Text style={styles.postId}>{item.item.postId}</Text>
                    <Text style={styles.commentCaption}>Name: </Text><Text style={styles.authorName}>{item.item.name}</Text>
                    <Text style={styles.commentCaption}>Email: </Text><Text style={styles.authorEmail}>{item.item.email}</Text>
                    <Text style={styles.commentCaption}>Body: </Text><Text style={styles.commentText}>{item.item.body}</Text>
                </View>
    };

    useEffect(() => {
        if (postComments != null) setIsDownloadingComments(false);
        else downloadPostComments()
    }, [postComments])

  return (
    <View style={styles.container}>
      <Modal 
        animationType="fade"
        transparent={true}
        visible={true}
        onRequestClose={() => {
          hideModalWindow();
        }}
      >
       <TouchableOpacity 
            style={styles.container_2}
            activeOpacity={1} 
            onPressOut={() => {hideModalWindow()}}
        >
            <TouchableWithoutFeedback style={{flex: 1}}>
                <View style={styles.modalContainer}>
                {
                    postComments != null
                    ?
                    <FlatList 
                        data={postComments}
                        renderItem={commentItem}
                        keyExtractor={item => item.id}
                    />
                    : null
                }
                {
                    isDownloadingComments 
                    ? 
                    <View style={{}}>
                        <ActivityIndicator size={30} color={colors.lightBlue} />
                    </View>
                    : null
                }
                </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>   
      </Modal>
    </View>
  );
};

export default ModalWindow;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.lightGray
    },
    container_2 : {
        height: '100%', 
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    modalContainer: {
        width: '90%',
        height: '50%',
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    commentItem: {
        backgroundColor: colors.white,
        marginBottom: 10,
        borderBottomColor: colors.lightBlue,
        borderBottomWidth: 3,
        paddingBottom: 15
    },
    postId: {
        color: colors.lightGreen,
        fontSize: 17,
        fontWeight: '600'
    },
    authorName: {
        color: colors.black,
        fontSize: 17,
        fontWeight: '600'
    },
    authorEmail: {
        color: colors.black,
        fontStyle: 'italic',
        fontSize: 15,
        fontWeight: '500'
    },
    commentText: {
        color: colors.lightGray,
        fontStyle: 'italic',
        fontSize: 15,
        fontWeight: '500'
    },
    commentCaption: {
        color: colors.lightBlue,
        textDecorationLine: 'underline',
        fontSize: 17,
        fontWeight: '600'
    },
});
