import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { pick } from 'lodash-es'
import type { Stat } from '~/models/stat'

import IpInfoPopover from '~/components/ip-info'
import { Button } from '~/components/ui/button'
import {
  ActivityIcon,
  AddLinkFilledIcon,
  BubbleChartFilledIcon,
  ChatbubblesSharpIcon,
  CodeIcon,
  CommentIcon,
  CommentsIcon,
  ExtensionIcon,
  FileIcon,
  GamesIcon,
  GuestIcon,
  HeartIcon,
  LinkIcon,
  NotebookMinimalistic,
  NoteIcon,
  OnlinePredictionFilledIcon,
  PencilIcon,
  PhAlignLeft,
  RedisIcon,
  RefreshIcon,
} from '~/components/ui/icons'
import { fetchHitokoto, SentenceType } from '~/external/api/hitokoto'
import { getJinRiShiCiOne } from '~/external/api/jinrishici'
import { useSelector } from '~/store/hooks'
import { RESTManager } from '~/utils/rest'
import { parseDate } from '~/utils/time'

import DashboardCard from './card'

const StatContext = createContext<any>({})
const Dashboard = () => {
  const { data: stat, dataUpdatedAt } = useQuery({
    queryKey: ['stat'],
    queryFn: async () => {
      return RESTManager.api.aggregate.stat.get() as Promise<Stat>
    },
    initialData: new Proxy(
      {},
      {
        get() {
          return 'N/A'
        },
      },
    ) as Stat,
    refetchInterval: 3000,
  })

  const { data: siteWordCountData } = useQuery({
    queryKey: ['siteWordCount'],
    queryFn: async () => {
      return RESTManager.api.aggregate.count_site_words.get<{
        data: { length: number }
      }>()
    },
    initialData: {
      data: { length: 0 },
    },
  })
  const siteWordCount = siteWordCountData?.data.length || 0

  const { data: rl } = useQuery({
    queryKey: ['readAndLikeCounts'],
    queryFn: async () => {
      return RESTManager.api.aggregate.count_read_and_like.get<{
        totalLikes: number
        totalReads: number
      }>()
    },
    initialData: {
      totalLikes: 0,
      totalReads: 0,
    },
  })

  const { data: hitokotoData } = useQuery({
    queryKey: ['hitokoto'],
    queryFn: async () => {
      return fetchHitokoto([
        SentenceType.动画,
        SentenceType.原创,
        SentenceType.哲学,
        SentenceType.文学,
      ])
    },
    initialData: {
      hitokoto: '',
      from: '',
      created_at: '',
      creator: '',
      creator_uid: 0,
      from_who: '',
      id: 0,
      reviewer: 0,
      type: '',
      uuid: '',
    },
  })

  const postfix = Object.values(
    pick(hitokotoData, ['from', 'from_who', 'creator']),
  ).find(Boolean)
  const hitokoto = hitokotoData.hitokoto
    ? '没有获取到句子信息'
    : hitokotoData.hitokoto + (postfix ? ` —— ${postfix}` : '')

  const { data: shijuData } = useQuery({
    queryKey: ['shiju'],
    queryFn: async () => {
      return getJinRiShiCiOne()
    },
    initialData: {
      content: '',
      id: 0,
      origin: {
        author: '',
        content: [],
        dynasty: '',
        matchTags: [],
        title: '',
      },
    },
  })
  const shiju = shijuData.content

  const user = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [dataStat, setDataStat] = useState(() => {
    return [
      {
        label: '博文',
        value: stat.posts,
        icon: <CodeIcon />,
        actions: [
          {
            name: '撰写',
            primary: true,
            onClick() {},
          },
          {
            name: '管理',
            onClick() {},
          },
        ],
      },

      {
        label: '日记',
        value: stat.notes,
        // @ts-expect-error
        icon: <NoteIcon />,
        actions: [
          {
            name: '撰写',
            primary: true,
            onClick() {},
          },
          {
            name: '管理',
            onClick() {},
          },
        ],
      },

      {
        label: '页面',
        value: stat.pages,
        // @ts-expect-error
        icon: <FileIcon />,
        actions: [
          {
            primary: true,
            name: '管理',
            onClick() {},
          },
        ],
      },
      {
        label: '速记',
        value: stat.recently,
        // @ts-expect-error
        icon: <PencilIcon />,
        actions: [
          {
            primary: true,
            name: '记点啥',

            onClick() {},
          },
          {
            name: '管理',
            onClick() {},
          },
        ],
      },

      {
        label: '分类',
        value: stat.categories,
        // @ts-expect-error
        icon: <ExtensionIcon />,
        actions: [
          {
            primary: true,
            name: '管理',
            onClick() {},
          },
        ],
      },

      {
        label: '全部评论',
        value: stat.allComments,
        // @ts-expect-error
        icon: <CommentIcon />,
        actions: [
          {
            primary: true,
            name: '管理',
            onClick() {},
          },
        ],
      },
      {
        label: '未读评论',
        value: stat.unreadComments,
        // @ts-expect-error
        icon: <ChatbubblesSharpIcon />,
        actions: [
          {
            primary: true,
            showBadage: true,
            name: '查看',
            onClick() {},
          },
        ],
      },

      {
        label: '友链',
        value: stat.links,
        // @ts-expect-error
        icon: <LinkIcon />,
        actions: [
          {
            primary: true,
            name: '管理',
            onClick() {},
          },
        ],
      },
      {
        label: '新的友链申请',
        value: stat.linkApply,
        // @ts-expect-error
        icon: <AddLinkFilledIcon />,
        actions: [
          {
            primary: true,
            showBadage: true,
            name: '查看',
            onClick() {},
          },
        ],
      },

      {
        label: '说说',
        value: stat.says,
        // @ts-expect-error
        icon: <CommentsIcon />,
        actions: [
          {
            primary: true,

            name: '说一句',
            onClick() {},
          },

          {
            primary: false,
            name: '管理',
            onClick() {},
          },
        ],
      },
      {
        label: '缓存',
        value: 'Redis',
        icon: <RedisIcon />,
        actions: [
          {
            primary: false,
            name: '清除 API 缓存',
            onClick() {},
          },
          {
            primary: false,
            name: '清除数据缓存',
            onClick() {},
          },
        ],
      },

      {
        label: 'API 总调用次数',
        value: stat.callTime,
        // @ts-expect-error
        icon: <ActivityIcon />,
        actions: [
          {
            primary: true,
            name: '查看',
            onClick() {},
          },
        ],
      },
      {
        label: '今日 IP 访问次数',
        value: stat.todayIpAccessCount,
        // @ts-expect-error
        icon: <BubbleChartFilledIcon />,
        actions: [
          {
            primary: true,
            name: '查看',
            onClick() {},
          },
        ],
      },
      {
        label: '全站字符数',
        value: siteWordCount,
        icon: <PhAlignLeft />,
      },

      {
        label: '总阅读量',
        value: rl.totalReads,
        icon: <NotebookMinimalistic />,
      },
      {
        label: '总点赞数',
        value: rl.totalLikes,
        // @ts-expect-error
        icon: <HeartIcon />,
      },

      {
        label: '当前在线访客',
        value: stat.online,
        // @ts-expect-error
        icon: <OnlinePredictionFilledIcon />,
      },
      {
        label: '今日访客',
        value: stat.todayOnlineTotal,
        // @ts-expect-error
        icon: <GuestIcon />,
      },
      {
        value: stat.todayMaxOnline,
        label: '今日最多同时在线人数',
        // @ts-expect-error
        icon: <GamesIcon />,
      },
    ]
  })
  return (
    <StatContext.Provider
      value={{
        user,
        hitokoto,
        shiju,
        siteWordCount,
        rl,
        dataUpdatedAt,
        stat,
        dataStat,
      }}
    >
      <DataStat />
      {/* <UserLoginStat /> */}
    </StatContext.Provider>
  )
}
const UserLoginStat = () => {
  const { user, hitokoto, shiju, siteWordCount, rl, dataUpdatedAt, stat } =
    useContext(StatContext)
  return (
    <>
      <h3 className="scroll-m-20 text-2xl font-light tracking-tight text-opacity-80">
        登录记录
      </h3>
      <p className="relative -mt-2 mb-3 text-gray-500">
        上次登录 IP:{' '}
        {user.user?.lastLoginIp ? (
          <IpInfoPopover
            ip={user.user?.lastLoginIp}
            trigger="click"
            triggerEl={<span>{user.user?.lastLoginIp}</span>}
          />
        ) : (
          'N/A'
        )}
        <div className="pt-[.5rem]" />
        <span>
          上次登录时间:{' '}
          {user.user?.lastLoginTime ? (
            <time>
              {parseDate(
                user.user?.lastLoginTime,
                'yyyy 年 M 月 d 日 HH:mm:ss',
              )}
            </time>
          ) : (
            'N/A'
          )}
        </span>
      </p>
      <div className="pb-4" />

      <div className="pt-[.5rem]" />
    </>
  )
}
const DataStat = () => {
  const { dataUpdatedAt, dataStat } = useContext(StatContext)
  return (
    <>
      <div className="flex flex-col items-start justify-center gap-6">
        <h3 className="scroll-m-20 text-2xl font-light tracking-tight text-opacity-80">
          数据统计
        </h3>

        <p className="relative -mt-4 mb-3 flex items-center text-gray-500">
          <span>数据更新于：</span>
          <time>
            {' '}
            {dataUpdatedAt
              ? parseDate(dataUpdatedAt, 'yyyy 年 M 月 d 日 HH:mm:ss')
              : 'N/A'}
          </time>

          <Button variant="link" type="button" className="ml-4">
            <RefreshIcon />
          </Button>
        </p>
      </div>
      <div className="grid w-full grid-cols-5 gap-4">
        {dataStat.map((props) => {
          return (
            <div className="col-span-1" key={props.label}>
              <DashboardCard {...props} />
            </div>
          )
        })}
      </div>
    </>
  )
}
export default Dashboard
