import React, {useEffect, useState} from 'react';
import {View, Image, Dimensions} from 'react-native';
import {Icon, Input, Text} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';

import {Story as IStory, StoryDetail} from '../core/interfaces/story';
import {colors} from '../constants/style';
import {addLike, createComment, getLike, getStory, removeLike} from '../api/story';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../context/auth-context';

export const Story: React.FC<{story: IStory; currentPage: boolean}> = ({story, currentPage}) => {
  const [imageHeight, setImageHeight] = useState(500);
  const [commentText, setCommentText] = useState('');
  const [commentDisabled, setCommentDisabled] = useState(false);
  const [storyDetail, setStoryDetail] = useState<StoryDetail>();
  const [liked, setLiked] = useState<boolean>(false);
  const [error, setError] = useState();
  const navigation = useNavigation();
  const {token} = useAuth();

  const getDetails = async () => {
    isLiked();
    try {
      const data = await getStory(story.id);
      setStoryDetail(data);
    } catch (err) {
      setError(err);
    }
  };

  const postComment = async () => {
    if (!token) {
      navigation.navigate('More', {screen: 'Login', initial: false});
    }
    try {
      setCommentDisabled(true);
      await createComment(story.id, commentText);
      await getDetails();
      setCommentText('');
    } finally {
      setCommentDisabled(false);
    }
  };

  const isLiked = async () => {
    try {
      const res = await getLike(story.id);
      console.log(res);
      setLiked(true);
    } catch (err) {
      console.log('isLiked:', err);
    }
  };

  const like = async () => {
    try {
      await addLike(story.id);
      setLiked(true);
      if (storyDetail) {
        setStoryDetail({...storyDetail, likes: storyDetail.likes + 1});
      }
    } catch (err) {
      console.log('like:', err);
    }
  };

  const unlike = async () => {
    try {
      await removeLike(story.id);
      setLiked(false);
      if (storyDetail) {
        setStoryDetail({...storyDetail, likes: storyDetail.likes - 1});
      }
    } catch (err) {
      console.log('unlike:', err);
    }
  };

  useEffect(() => {
    Image.getSize(story.image, (width, height) => {
      const imageWidth = Dimensions.get('screen').width;
      setImageHeight(height * (imageWidth / width));
    });
  }, []);

  useEffect(() => {
    if (currentPage && !storyDetail) {
      getDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <ScrollView contentContainerStyle={{paddingBottom: 100}} style={{flex: 1}} bounces={false}>
      <Image source={{uri: story.image}} style={{width: '100%', height: imageHeight}} />
      <View style={{padding: 15}}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 15}}>
          <Text style={{marginRight: 10}}>{storyDetail?.comments.count ?? 0}</Text>
          <Image
            source={require('../../assets/comment.png')}
            resizeMode="contain"
            style={{width: 40, height: 40}}
          />
          <Text style={{marginLeft: 20, marginRight: 8}}>{storyDetail?.likes ?? 0}</Text>
          <Icon
            type="ionicon"
            name={liked ? 'heart' : 'heart-outline'}
            size={40}
            color={liked ? colors.red : colors.white}
            onPress={() => {
              if (liked) {
                unlike();
              } else {
                like();
              }
            }}
          />
        </View>
        <Text style={{direction: 'rtl', marginBottom: 5}}>{storyDetail?.body}</Text>
        <View style={{height: 1, backgroundColor: colors.lightGray, marginVertical: 15}} />
        <Input
          value={commentText}
          containerStyle={{paddingHorizontal: 0}}
          inputContainerStyle={{
            paddingHorizontal: 20,
            borderRadius: 999,
            margin: 0,
            borderWidth: 1,
            borderColor: colors.lightGray,
          }}
          disabled={commentDisabled}
          rightIcon={{
            type: 'ionicon',
            name: commentText.length === 0 ? 'send-outline' : 'send',
            color: commentText.length === 0 ? colors.white : colors.blue,
            disabled: commentText.length === 0,
            disabledStyle: {backgroundColor: 'transparent', opacity: 0.75},
            onPress: postComment,
          }}
          keyboardAppearance="dark"
          returnKeyType="send"
          onSubmitEditing={postComment}
          onChangeText={(value) => {
            setCommentText(value);
          }}
          inputStyle={{color: colors.white, borderWidth: 0, fontSize: 15}}
          placeholder="Write something..."
          placeholderTextColor={colors.lightGray}
        />
        {storyDetail?.comments.results.map((comment) => (
          <View key={comment.id} style={{marginBottom: 20}}>
            <Text style={{fontWeight: 'bold', fontSize: 15, marginBottom: 5}}>{comment.user.username}</Text>
            <Text style={{fontSize: 13, color: colors.lightGray, marginBottom: 5}}>{comment.body}</Text>
            {/* <Text style={{color: colors.lightGray, fontSize: 11}}>{dayjs(comment.created_at).}</Text> */}
          </View>
        ))}
      </View>
      {/* <View style={{height: 1000}} /> */}
    </ScrollView>
  );
};
