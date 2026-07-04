export type Visibility = 'public' | 'friends' | 'self'
export type FriendshipStatus = 'pending' | 'accepted'

export interface User {
  id: string
  name: string
  avatar: string
  bio: string
  className: string
  enrollYear: string
  hometown: string
  lastActiveAt: string
}

export interface Friendship {
  id: string
  fromId: string
  toId: string
  status: FriendshipStatus
}

export interface Feed {
  id: string
  authorId: string
  content: string
  createdAt: string
  likeCount: number
}

export interface Like {
  id: string
  feedId: string
  userId: string
}

export interface Photo {
  id: string
  feedId: string
  url: string
  visibility: Visibility
  uploadedBy: string
  caption: string
  createdAt: string
}

export interface Comment {
  id: string
  feedId: string
  authorId: string
  content: string
  createdAt: string
  likeCount: number
}

export interface Reply {
  id: string
  commentId: string
  authorId: string
  content: string
  createdAt: string
  likeCount: number
}

// 当前登录用户
export const CURRENT_USER_ID = 'u1'

export const users: User[] = [
  { id: 'u1', name: '陈思远', avatar: '', bio: '计算机科学 2008 级，热爱编程和摄影', className: '计科08-1', enrollYear: '2008', hometown: '杭州', lastActiveAt: '2024-10-15 16:00' },
  { id: 'u2', name: '林小晴', avatar: '', bio: '英语系才女，喜欢旅行和读书', className: '英语08-2', enrollYear: '2008', hometown: '厦门', lastActiveAt: '2024-10-15 14:20' },
  { id: 'u3', name: '王大伟', avatar: '', bio: '数学系学霸，辩论队队长', className: '数学08-1', enrollYear: '2008', hometown: '南京', lastActiveAt: '2024-10-14 22:00' },
  { id: 'u4', name: '赵雨萌', avatar: '', bio: '艺术学院，擅长水彩画', className: '艺术08-1', enrollYear: '2008', hometown: '苏州', lastActiveAt: '2024-10-10 12:00' },
  { id: 'u5', name: '刘浩然', avatar: '', bio: '物理系，天文社社长', className: '物理08-2', enrollYear: '2008', hometown: '北京', lastActiveAt: '2024-10-13 09:00' },
  { id: 'u6', name: '张思琪', avatar: '', bio: '新闻系，校报编辑', className: '新闻08-1', enrollYear: '2008', hometown: '成都', lastActiveAt: '2024-10-09 17:00' },
  { id: 'u7', name: '李明轩', avatar: '', bio: '化学系，实验达人', className: '化学08-1', enrollYear: '2008', hometown: '武汉', lastActiveAt: '2024-10-08 20:00' },
  { id: 'u8', name: '周雅婷', avatar: '', bio: '中文系，诗词社副社长', className: '中文08-2', enrollYear: '2008', hometown: '长沙', lastActiveAt: '2024-10-08 16:00' },
  { id: 'u9', name: '吴天宇', avatar: '', bio: '电子工程，机器人战队成员', className: '电子08-1', enrollYear: '2008', hometown: '深圳', lastActiveAt: '2024-10-09 19:00' },
  { id: 'u10', name: '孙晓雪', avatar: '', bio: '心理学系，校园咨询师', className: '心理08-1', enrollYear: '2008', hometown: '大连', lastActiveAt: '2024-10-07 11:00' },
]

export const friendships: Friendship[] = [
  { id: 'f1', fromId: 'u1', toId: 'u2', status: 'accepted' },
  { id: 'f2', fromId: 'u1', toId: 'u3', status: 'accepted' },
  { id: 'f3', fromId: 'u4', toId: 'u1', status: 'pending' },
  { id: 'f4', fromId: 'u1', toId: 'u5', status: 'accepted' },
  { id: 'f5', fromId: 'u6', toId: 'u1', status: 'pending' },
  { id: 'f6', fromId: 'u1', toId: 'u9', status: 'accepted' },
  { id: 'f7', fromId: 'u2', toId: 'u3', status: 'accepted' },
  { id: 'f8', fromId: 'u3', toId: 'u5', status: 'accepted' },
  { id: 'f9', fromId: 'u2', toId: 'u5', status: 'accepted' },
]

export const feeds: Feed[] = [
  { id: 'fd1', authorId: 'u1', content: '今天在图书馆拍到一组校园秋景，和大家分享！', createdAt: '2024-10-15 14:30', likeCount: 5 },
  { id: 'fd2', authorId: 'u2', content: '周末去了趟西湖，风景如画，推荐大家去看看～', createdAt: '2024-10-14 09:15', likeCount: 8 },
  { id: 'fd3', authorId: 'u3', content: '辩论赛决赛我们队拿了冠军！感谢队友们的努力！', createdAt: '2024-10-13 20:00', likeCount: 12 },
  { id: 'fd4', authorId: 'u5', content: '昨晚在天台拍到了猎户座流星雨，太震撼了！', createdAt: '2024-10-12 23:45', likeCount: 15 },
  { id: 'fd5', authorId: 'u1', content: '毕业五周年聚会照片整理好了，满满的回忆啊。', createdAt: '2024-10-11 16:20', likeCount: 9 },
  { id: 'fd6', authorId: 'u4', content: '最新水彩作品完成，灵感来自校园的银杏大道。', createdAt: '2024-10-10 11:00', likeCount: 6 },
  { id: 'fd7', authorId: 'u9', content: '机器人比赛拿到亚军，下次一定要拿冠军！', createdAt: '2024-10-09 18:30', likeCount: 7 },
  { id: 'fd8', authorId: 'u8', content: '写了一首关于秋天的小诗，发在诗词社公众号上了。', createdAt: '2024-10-08 15:00', likeCount: 4 },
]

export const likes: Like[] = [
  { id: 'lk1', feedId: 'fd1', userId: 'u2' },
  { id: 'lk2', feedId: 'fd1', userId: 'u3' },
  { id: 'lk3', feedId: 'fd2', userId: 'u1' },
  { id: 'lk4', feedId: 'fd2', userId: 'u3' },
  { id: 'lk5', feedId: 'fd3', userId: 'u2' },
  { id: 'lk6', feedId: 'fd3', userId: 'u1' },
  { id: 'lk7', feedId: 'fd4', userId: 'u1' },
  { id: 'lk8', feedId: 'fd5', userId: 'u2' },
  { id: 'lk9', feedId: 'fd6', userId: 'u1' },
  { id: 'lk10', feedId: 'fd7', userId: 'u1' },
  { id: 'lk11', feedId: 'fd5', userId: 'u3' },
]

export const photos: Photo[] = [
  { id: 'p1', feedId: 'fd1', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=autumn%20campus%20library%20golden%20leaves%20warm%20sunlight&image_size=landscape_4_3', visibility: 'public', uploadedBy: 'u1', caption: '图书馆前的银杏大道', createdAt: '2024-10-15 14:28' },
  { id: 'p2', feedId: 'fd1', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=autumn%20university%20courtyard%20fallen%20leaves%20bench&image_size=landscape_4_3', visibility: 'public', uploadedBy: 'u1', caption: '校园小径', createdAt: '2024-10-15 14:29' },
  { id: 'p3', feedId: 'fd2', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=west%20lake%20hangzhou%20misty%20water%20bridge&image_size=landscape_4_3', visibility: 'public', uploadedBy: 'u2', caption: '西湖断桥', createdAt: '2024-10-14 08:30' },
  { id: 'p4', feedId: 'fd3', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=debate%20competition%20stage%20trophy%20students&image_size=landscape_4_3', visibility: 'friends', uploadedBy: 'u3', caption: '辩论赛颁奖', createdAt: '2024-10-13 19:50' },
  { id: 'p5', feedId: 'fd4', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=orion%20meteor%20shower%20night%20sky%20rooftop&image_size=landscape_4_3', visibility: 'public', uploadedBy: 'u5', caption: '猎户座流星雨', createdAt: '2024-10-12 23:30' },
  { id: 'p6', feedId: 'fd5', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=reunion%20group%20photo%20college%20friends&image_size=landscape_4_3', visibility: 'friends', uploadedBy: 'u1', caption: '五周年聚会', createdAt: '2024-10-11 16:00' },
  { id: 'p7', feedId: 'fd5', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=college%20dinner%20party%20friends%20laughing&image_size=landscape_4_3', visibility: 'self', uploadedBy: 'u1', caption: '聚餐合影', createdAt: '2024-10-11 16:10' },
  { id: 'p8', feedId: 'fd6', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=watercolor%20painting%20ginkgo%20avenue%20autumn&image_size=landscape_4_3', visibility: 'public', uploadedBy: 'u4', caption: '银杏大道水彩画', createdAt: '2024-10-10 10:30' },
  { id: 'p9', feedId: 'fd7', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=robot%20competition%20engineering%20students&image_size=landscape_4_3', visibility: 'friends', uploadedBy: 'u9', caption: '机器人比赛', createdAt: '2024-10-09 18:00' },
  { id: 'p10', feedId: 'fd8', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20calligraphy%20poetry%20autumn&image_size=landscape_4_3', visibility: 'public', uploadedBy: 'u8', caption: '秋日诗笺', createdAt: '2024-10-08 14:30' },
]

export const comments: Comment[] = [
  { id: 'c1', feedId: 'fd1', authorId: 'u2', content: '好美的秋景！下次一起去拍照吧', createdAt: '2024-10-15 15:00', likeCount: 2 },
  { id: 'c2', feedId: 'fd1', authorId: 'u3', content: '图书馆前那棵银杏真的绝了', createdAt: '2024-10-15 15:30', likeCount: 1 },
  { id: 'c3', feedId: 'fd2', authorId: 'u1', content: '西湖太美了，下次带上我！', createdAt: '2024-10-14 10:00', likeCount: 3 },
  { id: 'c4', feedId: 'fd3', authorId: 'u2', content: '恭喜大伟！你们太厉害了', createdAt: '2024-10-13 21:00', likeCount: 0 },
  { id: 'c5', feedId: 'fd4', authorId: 'u1', content: '流星雨太壮观了！用望远镜拍的吗？', createdAt: '2024-10-13 08:00', likeCount: 1 },
  { id: 'c6', feedId: 'fd5', authorId: 'u2', content: '五年了，好想念大家', createdAt: '2024-10-11 17:00', likeCount: 2 },
  { id: 'c7', feedId: 'fd6', authorId: 'u1', content: '画得真棒，银杏的颜色太美了', createdAt: '2024-10-10 12:00', likeCount: 1 },
  { id: 'c8', feedId: 'fd8', authorId: 'u3', content: '读起来意境深远，收藏了', createdAt: '2024-10-08 16:00', likeCount: 0 },
]

export const replies: Reply[] = [
  { id: 'r1', commentId: 'c1', authorId: 'u1', content: '好啊！周末约起来', createdAt: '2024-10-15 15:10', likeCount: 0 },
  { id: 'r2', commentId: 'c2', authorId: 'u1', content: '是啊，每年秋天最美的时候', createdAt: '2024-10-15 15:35', likeCount: 1 },
  { id: 'r3', commentId: 'c3', authorId: 'u2', content: '没问题！下次一起去', createdAt: '2024-10-14 10:30', likeCount: 0 },
  { id: 'r4', commentId: 'c5', authorId: 'u5', content: '嗯，用了200mm长焦', createdAt: '2024-10-13 09:00', likeCount: 0 },
  { id: 'r5', commentId: 'c6', authorId: 'u3', content: '是啊，时光飞逝', createdAt: '2024-10-11 18:00', likeCount: 1 },
  { id: 'r6', commentId: 'c7', authorId: 'u4', content: '谢谢思远！改天给你画一幅', createdAt: '2024-10-10 13:00', likeCount: 0 },
]
