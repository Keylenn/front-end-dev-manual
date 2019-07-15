import React, { useEffect, useRef  } from 'react';
/**
 * @description 参考资源
 * 1: 【第1645期】useHooks~小窍门, https://mp.weixin.qq.com/s/fp-GNIcz5zwrikcM0648DQ
 * 2: awesome-react-hooks, https://github.com/rehooks/awesome-react-hooks
 */

/** -----------------------------------------------1.DOM副作用的修改/监听-----------------------------------------------*/

/**
 * @description: 修改页面标题
 * @param {string} title
 */
export function useDocumentTitle(title) {
  useEffect (() => {
      document.title = title;
  }, [title]);
}

/**
 * @description: 绑定监听事件
 * @param {type} title
 * @return: 
 */
export function useEventListener(eventName, handler, element = global) {
  // 创建一个储存处理方法的ref
  const savedHandler = useRef(null);

  // 当处理函数改变的时候更新ref.current的方法
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  
  // 绑定监听事件，组件销毁后移除事件监听
  useEffect( () => {
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      const eventHandler = (e) => savedHandler.current(e);

      element.addEventListener(eventName, eventHandler);

      return () => {
        element.removeEventListener(eventName, eventHandler);
      };
    }, [eventName, element] );
}


/** -----------------------------------------------2.网络请求-----------------------------------------------*/
// 未修改
export const usePromise = (
    fn,
    { resolve = false, resolveCondition = [] } = {}
  ) => {
    const [data, setData] = useState();
    const [isLoading, setLoading] = useState(resolve);
    const [lastUpdated, setLastUpdated] = useState();
    const [error, setError] = useState();
  
    const request = (...args) => {
      /*
      Using isValid guard, in order to prevent the cleanup warning.
      */
      let isValid = true;
      setLoading(true);
  
      fn(...args)
        .then(result => {
          if (!isValid) return;
  
          setData(result);
          setLastUpdated(Date.now());
        })
        .catch(err => {
          if (!isValid) return;
  
          setError(err);
        })
        .finally(() => {
          if (!isValid) return;
  
          setLoading(false);
        });
  
      /*
      When component will be unmounted, isValid will become false and state setter
      functions will not be envoked on unmounted component.
      */
      return () => {
        isValid = false;
      };
    };
  
    if (resolve) {
      useEffect(request, resolveCondition);
    }
  
    return {
      request,
      data,
      isLoading,
      lastUpdated,
      error
    };
  };

/** -------------------------------------------3.全局样式/css动画--------------------------------------------*/

/**
 * @description: 全局样式，挂载在根元素上
 * @param {type} 
 * @return: 
 */
export function useTheme(theme) {
  useLayoutEffect( () => {
      // 循环这个主题对象
      for (const key in theme) {
        // 更新文档根元素的css变量
        document.documentElement.style.setProperty(`--${key}`, theme[key]);
      }
    }, [theme] );
}


/** -----------------------------------------------4.性能优化-----------------------------------------------*/

/**
 * @description: 工具：用于优化不必要的重渲染
 * @param {type} 
 * @return: 
 */

export function useWhyDidYouUpdate(ComponentName, props) {
  // 利用useRef存储当前的props
  const previousProps = useRef(null);

  useEffect(() => {
    if (previousProps.current) {
      // 获取改变前后所有的props的key值
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      // 使用这个对象去跟踪改变的props
      const changesObj = {};
      allKeys.forEach(key => {
        // 若改变前的值是否和当前的不一致， 将prop添加到用来追踪的对象中
        if (previousProps.current[key] !== props[key]) {
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key]
          };
        }
      });

      // 如果改变的props不为空，则输出到控制台
      if (Object.keys(changesObj).length) {
        console.log('[why-did-you-update]', ComponentName, changesObj);
      }
    }

    previousProps.current = props;
  });
}
  