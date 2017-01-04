### THIS IS A WORK IN PROGRESS

# react-native-redux-rest-resource
A helper to handle REST Apis with Redux in react-native

# How to set it up

```js
// resources.js
import Resource from 'react-native-redux-rest-resource';

export const PostsResource = Resource(
    'post',
    {
        API_URL: 'https://mygreat.api.com/v1/', // Define the URL of your API
        HTTP_HEADERS: { X-MOBILE-TOKEN: 'j3rkl2uh44u4uys87w3874y3rt3487wrtyw87' }, // Set extra headers
    }
);
```

```js
// store.js
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Platform } from 'react-native';
import devTools from 'remote-redux-devtools';
import Thunk from 'redux-thunk';
import { PostsResource } from './resources';
import PostsReducer from './postsReducer';

const enhancer = compose(
    applyMiddleware(Thunk, PostsResource.middleware),
    devTools({
        hostname: 'localhost',
        port: 28000,
        name: `MyAPP_${Platform.OS}`,
    })
);

export default createStore(
    combineReducers({
        Posts: PostsReducer,
    }),
    enhancer
);
```

# How to trigger RESTful Requests

```js
// TestClass.js
import React, { Component } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { PostsResource } from './resources';

const styles = StyleSheet.create({
    container: {}
});

class TestClass extends Component {
    componentDidMount() {
        this.props.index(); // Get all the posts
        this.props.create({ content: 'Hello' }); // Create a post
        setTimeout(() => this.props.read(this.props.posts[0].id), 5000); // Get a post
        setTimeout(() => this.props.update({ content: 'Hello There!' }, 1), 10000); // Create a post
        setTimeout(() => this.props.delete(1), 20000); // Delete the post of ID 1
    }

    render() {
        return (
            <View style={styles.container}>
                {!this.props.loading && !this.props.error
                    ? this.props.posts.map((post) => (
                        <View key={post.id}>
                            <Text>{post.content}</Text>
                        </View>
                    ))
                    : null
                }
                {this.props.loading
                    ? <ActivityIndicator />
                    : null
                }
                {this.props.error
                    ? <Text>{this.props.error.message}</Text>
                    : null
                }
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    posts: Object.values(state.Posts.List),
    error: state.Posts.error,
    loading: state.Posts.loading,
});
const mapDispatchToProps = (dispatch) => bindActionCreators(
    PostsResource.actionCreators,
    dispatch
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TestClass);
```

# How to handle the result of the requests

```js
// postsReducer.js
import PostsResource from './resources';

export default = (
    state = {
        List: {},
        loading: false,
        error: null,
    },
    action
) => {
    switch (action.type) {
        case PostsResource.actions.CREATE:
        case PostsResource.actions.READ:
        case PostsResource.actions.UPDATE:
        case PostsResource.actions.DELETE:
        case PostsResource.actions.INDEX:
            return {
                ...state,
                loading: true,
            };
        case PostsResource.actions.CREATE_SUCCESS:
        case PostsResource.actions.READ_SUCCESS:
        case PostsResource.actions.UPDATE_SUCCESS:
            return {
                ...state,
                List: {
                    ...state.List,
                    [action.payload.id]: action.payload,
                },
                loading: false,
                error: null,
            };
        case PostsResource.actions.DELETE_SUCCESS:
            const updatedList = { ...state.List };

            delete updatedList[action.meta.id];

            return {
                ...state,
                List: updatedList,
                loading: false,
                error: null,
            };
        case PostsResource.actions.INDEX_SUCCESS:
            return {
                ...state,
                List: {
                    ...state.List,
                    ...action.payload.reduce((accumulator, post) => {
                        accumulator[post.id] = post;

                        return accumulator;
                    }, {}),
                },
                loading: false,
                error: null,
            };
        case PostsResource.actions.CREATE_FAILURE:
        case PostsResource.actions.READ_FAILURE:
        case PostsResource.actions.UPDATE_FAILURE:
        case PostsResource.actions.DELETE_FAILURE:
        case PostsResource.actions.INDEX_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};
```

# Options

| KEY                       | VALUE         | DEFAULT VALUE | WHAT DOES IT DO |
| ---                       | ------        | ------------- | --------------- |
| API_URL                   | URL | `'localhost/'` | The Base url of your API |
| CAMELIZE_DECAMELIZE       | true/false    | `true`          | All the keys of objects coming in from the server will be camelized (ex: `customer_id` will be transformed to `customerId`) and everything that goes out of the client will be decamelized (ex: `customerId` will be transformed to `customer_id`) |
| DEBUG                     | true/false    | `true`          | `console.log`s stuff about what is happening network-wise |
| HTTP_ERROR_CODE_MESSAGES  | An object with keys being the status code and values being the messages | `{`<br/>`401: 'FORBIDDEN',`<br/>`403: 'FORBIDDEN',`<br/>`404: 'NOT_FOUND',`<br/>`}` | Customize the messages of the errors caught while doing the requests |
| HTTP_HEADERS              | Headers put on the requests | `{}` | Headers to add to the requests |
| JWT_TOKEN                 | YOUR_JWT_TOKEN              | `null` | This will add an `Authorization` header with value `Bearer YOUR_JWT_TOKEN`  |
| REDUX_ACTIONS_PREFIX | Prefix to add to actions type | 'RNRRR' | Namespaces actions to avoid conflicts with your actions |

# TODO

 * postfix actionCreators with appropriate `endpoint` camelized and pluralized term
 * Create Basic Reducer automatically?
