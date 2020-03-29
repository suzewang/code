import React, { useState, useEffect } from 'react';
import { Router, Overlay, Modal, Lightbox, Scene, Tabs, Actions } from 'react-native-router-flux';
import Home from './components/Home';
import Icon from 'react-native-vector-icons/FontAwesome';
import Goods from './components/Goods';
import My from './components/My';
import MyRelease from './components/MyRelease';
import { Image, TouchableOpacity, AsyncStorage, View, BackHandler, ToastAndroid } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import SwiperPage from './components/SwiperPage';
import Login from './components/Login';
import Register from './components/Register';

console.disableYellowBox = true;

const App = () => {
	let [isLogin, setLogin] = useState(false);
	let [isInstall, setInstall] = useState(true);
	let now = 0;
	useEffect(() => {
		AsyncStorage.getItem('isInstall')
			.then(res => {
				if (res) {
					setInstall(false);
				}
			})
		AsyncStorage.getItem('user')
			.then(res => {
				let user = JSON.parse(res)
				if (!user) {
					SplashScreen.hide();
				}
				if (user && user.token) {
					setLogin(true);
					SplashScreen.hide();
				}
			})
	}, []);
	let afterInstall = () => {
		setInstall(false);
	}
	if (isInstall) {
		return <View style={{ flex: 1 }}>
			<SwiperPage afterInstall={afterInstall} />
		</View>
	}
	return (
		<Router
			backAndroidHandler={() => {
				if (Actions.currentScene == 'login') {
					if (new Date().getTime() - now < 2000) {
						BackHandler.exitApp();
					} else {
						ToastAndroid.show('确定要退出吗', 100);
						now = new Date().getTime();
						return true;
					}
				}
			}}
		>
			<Overlay>
				<Modal key="modal">
					<Lightbox key="lightbox" hideNavBar>
						<Scene key="root">
							<Tabs
								key='tabbar'
								hideNavBar
								activeTintColor="red"
								inactiveTintColor="gray"
								tabBarStyle={{ backgroundColor: '#ccc' }}
							>
								<Scene key='home'
									hideNavBar={true}
									title='首页'
									component={Home}
									icon={
										({ focused }) => <Icon
											color={focused ? 'red' : 'gray'}
											name="home"
											size={25}
										/>
									}
								/>
								<Scene key='goods'
									hideNavBar={true}
									title='商品分类'
									component={Goods}
									icon={
										({ focused }) => <Icon
											color={focused ? 'red' : 'gray'}
											name="th-large"
											size={25}
										/>
									}
								/>
								<Scene
									key='shop'
									hideNavBar={true}
									title="购物车"
									component={Goods}
									icon={
										({ focused }) => <Icon
											color={focused ? 'red' : 'gray'}
											name="shopping-cart"
											size={25}
										/>
									}
								/>
								<Scene
									key='my'
									hideNavBar={true}
									title="个人中心"
									component={My}
									icon={
										({ focused }) => <Icon
											color={focused ? 'red' : 'gray'}
											name="user"
											size={25}
										/>
									}
								/>
							</Tabs>
						</Scene>
					</Lightbox>
					<Scene
						key="myrelease"
						component={MyRelease}
						renderBackButton={() => ( //返回按钮图标
							<TouchableOpacity onPress={() => Actions.pop()}>
								<Image style={{ height: 56 }} source={require('./assets/r2.png')} />
							</TouchableOpacity>
						)}
						title="我的发布"
						titleStyle={{ flex: 1, textAlign: 'center', textAlignVertical: 'center', color: 'white', backgroundColor: 'rgb(242,48,48)', width: '100%', height: '100%' }}
						renderRightButton={() => ( //右按钮图标
							<TouchableOpacity>
								<Image style={{ height: 56 }} source={require('./assets/r3.png')} />
							</TouchableOpacity>
						)}
					/>
					<Scene initial={!isLogin} key="login" component={Login} hideNavBar />
					<Scene key="register" component={Register} hideNavBar />
				</Modal>
			</Overlay>
		</Router>
	);
};


export default App;