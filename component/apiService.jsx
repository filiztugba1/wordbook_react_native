// apiService.js

import axios from 'axios';
import { API_URL } from './config';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
const apiService = axios.create({
  baseURL: API_URL,
});

const login = async (loginform) => {
  try {
    const response = await apiService.post(`${API_URL}/login`,loginform);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const words = async () => {
    const accessToken = AsyncStorage.getItem('AccessToken');
    console.log('accessToken',accessToken);
    try {
      const response = await apiService.get(`${API_URL}/words`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
    });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const wordGroups = async (selectid) => {
    const accessToken = AsyncStorage.getItem('AccessToken');
    console.log('accessToken',accessToken);
    try {
      const response = await apiService.get(`${API_URL}/WordGroups`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
    });
      
      const formattedData = response.data.map(item => {
        // Her bir öğe için yeni bir nesne oluştur
        return {
          key: item.wg_id.toString(), // Key değeri wg_id'nin bir dize olarak dönüştürülmüş hali
          value: item.wg_name, // Value değeri wg_name'in kendisi
          child:item.child,
          selected:selectid!=undefined && selectid==item.wg_id 
        };
      });
      return formattedData;
    } catch (error) {
      throw error;
    }
  };

  const meansType = async () => {
    const accessToken = AsyncStorage.getItem('AccessToken');
    console.log('accessToken',accessToken);
    try {
      const response = await apiService.get(`${API_URL}/MeansType`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
    });
      
      const formattedData = response.data.map(item => {
        // Her bir öğe için yeni bir nesne oluştur
        return {
          key: item.mt_short_name, 
          value: item.mt_name,
          id:item.mt_id
        };
      });
      return formattedData;

    } catch (error) {
      throw error;
    }
  };


  const meansTypeList = async () => {
    const accessToken = AsyncStorage.getItem('AccessToken');
        try {
        const response = await apiService.get(`${API_URL}/MeansType`,{
            headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
            }
        });
      return response.data;

    } catch (error) {
      throw error;
    }
  };

  const meansTypeAdd = async (formdata) => {
    const accessToken = AsyncStorage.getItem('AccessToken');
        try {
        const response = await apiService.post(`${API_URL}/MeansType`,formdata,{
            headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
            }
        });
      return response.data;

    } catch (error) {
      throw error;
    }
  };

  const meansTypeUpdate = async (formdata) => {
    const accessToken = AsyncStorage.getItem('AccessToken');
        try {
        const response = await apiService.put(`${API_URL}/MeansType`,formdata,{
            headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
            }
        });
      return response.data;

    } catch (error) {
      throw error;
    }
  };

  const meansTypeDelete = async (id) => {
    const accessToken = AsyncStorage.getItem('AccessToken');
        try {
        const response = await apiService.delete(`${API_URL}/MeansType/${id}`,{
            headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
            }
        });
      return response.data;

    } catch (error) {
      throw error;
    }
  };


  const wordGroupList = async () => {
    const accessToken = AsyncStorage.getItem('AccessToken');
        try {
        const response = await apiService.get(`${API_URL}/WordGroups`,{
            headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
            }
        });
      return response.data;

    } catch (error) {
      throw error;
    }
  };

  const wordGroupAdd = async (formdata) => {
    const accessToken = AsyncStorage.getItem('AccessToken');
        try {
        const response = await apiService.post(`${API_URL}/WordGroups`,formdata,{
            headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
            }
        });
      return response.data;

    } catch (error) {
      throw error;
    }
  };

  const wordGroupUpdate = async (formdata) => {
    const accessToken = AsyncStorage.getItem('AccessToken');
        try {
        const response = await apiService.put(`${API_URL}/WordGroups`,formdata,{
            headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
            }
        });
      return response.data;

    } catch (error) {
      throw error;
    }
  };

  const wordGroupDelete = async (id) => {
    const accessToken = AsyncStorage.getItem('AccessToken');
        try {
        const response = await apiService.delete(`${API_URL}/WordGroups/${id}`,{
            headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
            }
        });
      return response.data;

    } catch (error) {
      throw error;
    }
  };

  

// const getUserProfile = async (userId) => {
//   try {
//     const response = await apiService.get(`${USER_PROFILE_URL}/${userId}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };


const wordsAdd = async (formdata) => {
  const accessToken = AsyncStorage.getItem('AccessToken');
      try {
      const response = await apiService.post(`${API_URL}/Words/bulksave`,formdata,{
          headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
          }
      });
    return response.data;

  } catch (error) {
    throw error;
  }
};
const wordUpdate = async (formdata) => {
  const accessToken = AsyncStorage.getItem('AccessToken');
      try {
      const response = await apiService.put(`${API_URL}/Words`,formdata,{
          headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
          }
      });
    return response.data;

  } catch (error) {
    throw error;
  }
};
const wordDelete = async (formdata) => {
  const accessToken = AsyncStorage.getItem('AccessToken');
      try {
      const response = await apiService.delete(`${API_URL}/Words/${formdata.w_id}`,{
          headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
          }
      });
    return response.data;

  } catch (error) {
    throw error;
  }
};

const langList = async () => {
  const accessToken = AsyncStorage.getItem('AccessToken');
      try {
      const response = await apiService.get(`${API_URL}/Language`);
  
    const langData = response.data.map(item => {
      // Her bir öğe için yeni bir nesne oluştur
      return {
        key: item.l_id, 
        value: item.l_name,  
      };
    });
    return langData;

  } catch (error) {
    throw error;
  }
};

const usermailonay = async (formdata) => {
      try {
      const response = await apiService.post(`${API_URL}/User/UserMailOnay`,formdata);
      return response;

  } catch (error) {
    throw error;
  }
};

const usersave = async (formdata) => {
  try {
  const response = await apiService.post(`${API_URL}/User/CreateUserList`,formdata);
  return response;

} catch (error) {
throw error;
}
};

const onayKodGonder = async (formdata) => {
  try {
  const response = await apiService.post(`${API_URL}/User/OnayKodGonder`,formdata);
  return response;

} catch (error) {
throw error;
}
};

const changePassword = async (formdata) => {
  try {
  const response = await apiService.post(`${API_URL}/User/ChangePassword`,formdata);
  return response;

} catch (error) {
throw error;
}
};


const userApi = async () => {
  const accessToken = AsyncStorage.getItem('AccessToken');
  try {
      const response = await apiService.get(`${API_URL}/User/getuser`,{
        headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        }
    });

      return response.data;

      } catch (error) {
      throw error;
      }
};


const userUpdate = async (formdata) => {
  const accessToken = AsyncStorage.getItem('AccessToken');
  try {
      const response = await apiService.put(`${API_URL}/User`,formdata,{
        headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        }
    });

      return response.data;

      } catch (error) {
      throw error;
      }
};


const dailyList = async () => {
  const accessToken = AsyncStorage.getItem('AccessToken');
  try {
      const response = await apiService.get(`${API_URL}/Daily`,{
        headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        }
    });

      return response.data;

      } catch (error) {
      throw error;
      }
};


const dailyUpdate = async (formdata) => {
  const accessToken = AsyncStorage.getItem('AccessToken');
  try {
      const response = await apiService.put(`${API_URL}/Daily`,formdata,{
        headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        }
    });

      return response.data;

      } catch (error) {
      throw error;
      }
};

const dailyAdd = async (formdata) => {
  const accessToken = AsyncStorage.getItem('AccessToken');
  try {
      const response = await apiService.post(`${API_URL}/Daily`,formdata,{
        headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        }
    });

      return response.data;

      } catch (error) {
      throw error;
      }
};

const UpdateWordStatus = async (formdata) => {
  const accessToken = AsyncStorage.getItem('AccessToken');
  try {
      const response = await apiService.post(`${API_URL}/Words/updatewordstatus`,formdata,{
        headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        }
    });

      return response.data;

      } catch (error) {
      throw error;
      }
};

const translateApi = async () => {
  // try {
  //   const response = await axios.get('http://esmiranet.com.tr/api/Translate');
  //   console.log(response);
  // }catch (error) {
  //   if (error.response) {
  //     // Sunucudan bir cevap geldi, ancak istek başarısız oldu
  //     console.error('Error response:', error.response.data);
  //     console.error('Error status:', error.response.status);
  //     console.error('Error headers:', error.response.headers);
  //   } else if (error.request) {
  //     // İstek yapıldı, ancak sunucudan hiçbir cevap alınmadı
  //     console.error('No response received:', error.request);
  //   } else {
  //     // İstek yapılırken bir hata oluştu
  //     console.error('Error setting up the request:', error.message);
  //   }
  // }
  try {
      const response = await apiService.get(`${API_URL}/Translate`);
      return response.data;

      } catch (error) {
      throw error;
      }
};
const LanguageFind = (word) => {
  try {

    let lanCode="";

    AsyncStorage.getItem('user', (error, data) => {
      
      const { languageCode } = RNLocalize.getLocales()[0];
      if (error) {
        lanCode=languageCode;
      }
      if (!data) {
            
            lanCode=languageCode;
      }
      else
      {
        const userData = JSON.parse(data);
        lanCode = userData.mainlanguage ? userData.mainlanguage.l_code : languageCode;
      }

        AsyncStorage.getItem('translate', (errortrans, datatrans) => {
          if (errortrans) {
            return word;
          }
          if (!data) {
                
            return word;
          }
          else
          {
            const lanWord=JSON.parse(transList);
            const userData = JSON.parse(data);
            rword = userData.lenght>0 ? lanWord.find(trans => trans.unic_name===word && trans.l_code===lanCode) : word;
            return rword;
          }
        });
    });

  //   if(user!==undefined && user!=="" && user!==null)
  //   {
  //     lanCode=JSON.parse(user).mainlanguage.l_code;
  //   }
  //   else
  //   {
  //     const { languageCode } = RNLocalize.getLocales()[0];
  //     lanCode=languageCode;
  //   }
  //  const transList= localStorage.getItem('translate');

  //       if(transList!==undefined && transList!==null)
  //       {
  //         let lanWord=JSON.parse(transList).find(trans => trans.unic_name===word && trans.l_code===lanCode);
  //         if(lanWord==undefined || lanWord==null)
  //         {
  //           return word;
  //         }
  //         return lanWord.name;
  //       }
        return word;
      } catch (error) {
      throw error;
      }
};


export { login,words,wordGroups,meansType,meansTypeList,meansTypeAdd,meansTypeUpdate,meansTypeDelete,
    wordGroupList,wordGroupAdd,wordGroupUpdate,wordGroupDelete,wordsAdd,wordUpdate,wordDelete,langList,usermailonay,usersave,onayKodGonder,changePassword,userApi,userUpdate,dailyList
    ,dailyUpdate,dailyAdd,UpdateWordStatus,translateApi,LanguageFind};
