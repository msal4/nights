import React, {useEffect, useState} from 'react';
import {View, Image as RImage, Dimensions} from 'react-native';
import {Icon, Image, Input, Text} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

import {colors} from '../constants/style';
import LoadingIndicator from './LoadingIndicator';

export const Story: React.FC<{id: number; currentPage: number}> = ({id, currentPage}) => {
  const [imageHeight, setImageHeight] = useState(500);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    RImage.getSize(
      'http://cinema.shashety.com/storage/posters/600_ACooqNbz6KT7qrH1jfVd.jpg',
      (width, height) => {
        const imageWidth = Dimensions.get('screen').width;
        setImageHeight(height * (imageWidth / width));
      },
    );
  }, []);

  useEffect(() => {
    if (currentPage === id) {
      console.log('fetched:', id);
    }
  }, [currentPage]);

  return (
    <ScrollView contentContainerStyle={{paddingBottom: 100}} bounces={false}>
      <Image
        source={{uri: 'http://cinema.shashety.com/storage/posters/600_ACooqNbz6KT7qrH1jfVd.jpg'}}
        PlaceholderContent={<LoadingIndicator />}
        placeholderStyle={{backgroundColor: 'transparent'}}
        style={{width: '100%', height: imageHeight}}
      />
      <View style={{padding: 15}}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 15}}>
          <Text style={{marginRight: 10}}>150</Text>
          <Image
            source={require('../../assets/comment.png')}
            resizeMode="contain"
            placeholderStyle={{backgroundColor: 'transparent'}}
            style={{width: 40, height: 40}}
          />
          <Text style={{marginLeft: 20, marginRight: 8}}>150</Text>
          <Icon type="ionicon" name="heart-outline" size={40} color={colors.white} />
        </View>
        <Text style={{direction: 'rtl', marginBottom: 5}}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor officiis ad harum distinctio itaque
          excepturi quia veritatis voluptatem perspiciatis voluptates, incidunt cumque a doloremque nulla sed
          nemo optio suscipit dignissimos!
        </Text>
        <Text style={{color: colors.lightGray, fontSize: 12}}>two days ago at 04:00am</Text>
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
          rightIcon={{
            type: 'ionicon',
            name: commentText.length === 0 ? 'send-outline' : 'send',
            color: commentText.length === 0 ? colors.white : colors.blue,
            disabled: commentText.length === 0,
            disabledStyle: {backgroundColor: 'transparent', opacity: 0.75},
            onPress: () => {
              setCommentText('');
            },
          }}
          keyboardAppearance="dark"
          returnKeyType="send"
          onSubmitEditing={() => {
            setCommentText('');
          }}
          onChangeText={(value) => {
            setCommentText(value);
          }}
          inputStyle={{color: colors.white, borderWidth: 0, fontSize: 15}}
          placeholder="Write something..."
          placeholderTextColor={colors.lightGray}
        />
        {[1, 2, 3].map((i) => (
          <View key={i} style={{marginBottom: 20}}>
            <Text style={{fontWeight: 'bold', fontSize: 15, marginBottom: 5}}>Sajad</Text>
            <Text style={{fontSize: 13, color: colors.lightGray, marginBottom: 5}}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed iste doloribus rem adipisci sint
              impedit, illum porro perspiciatis molestiae quibusdam accusantium magnam corrupti corporis
              maxime aliquid expedita itaque odit odio.
            </Text>
            <Text style={{color: colors.lightGray, fontSize: 11}}>two days ago at 04:00am</Text>
          </View>
        ))}
      </View>
      {/* <View style={{height: 1000}} /> */}
    </ScrollView>
  );
};
