const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
Query: {
    me: async (parent, args, context) => {
        if (context.user) {
            const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')

            return userData;
        }
        throw new AuthenticationError('You\'re not logged in!');
    }
},

Mutation: {
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });

        if (!user) {
            throw new AuthenticationError('Nice Try! Your credentials are wrong!');
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
            throw new AuthenticationError('Nice Try! Your credentials are wrong!');
        }

        const token = signToken(user);
        return { token, user };
    },
    addUser: async (parents, args) => {
        const user = await User.create(args);
        const token = signToken(user);
        return { user, token };
    },
    saveBook: async (parent, args, context) => {
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: args.book } },
                { new: true }
            );

            return updatedUser;
        }

        throw new AuthenticationError('You must be logged in to do that!');
    },
    removeBook: async (parents, args, context) => {
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: args.bookId } } },
                { new: true }
            );

            return updatedUser;
        }

        throw new AuthenticationError('You must be logged in to do that!');
    }
}
};

module.exports = resolvers;