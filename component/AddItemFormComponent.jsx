import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Button,
  Image,
  FlatList,
  Picker
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from  'react-native-image-picker';
import * as XLSX from "xlsx";
import FontAwesomeIcon  from 'react-native-vector-icons/FontAwesome';
import { TextInput } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list'
import { wordGroups,meansType } from './apiService';
import { wordsAdd,LanguageFind} from './apiService';

const AddItemForm = ({ onAddItem ,params,crudApi,groupData,typeData}) => {
  const [formData, setFormData] = useState({
    wg_id: 0,
    wg_sub_id: 0,
    w_name: '',
    w_id:0,
    w_mains:[],
    w_image:'',
    examples:[],
    irregular:[],
  });
  const [formDataIrregular, setformDataIrregular] = useState({irr1:'',irr2:'',irr3:''});
  const [formDataMean, setformDataMean] = useState({ mean: '', type: '' });
 

  const [formDataMeans, setformDataMeans] = useState([]);
  const [formDataExp, setformDataExp] = useState({ we_name: '' });
  const [formDataExps, setformDataExps] = useState([]);
  const [subGroupIsActive, setsubGroupIsActive] = useState(false);


const [groupSubData, setgroupSubData] = React.useState([]);

useEffect(() => {
  if(params!==undefined)
  {
    setformDataMeans(params.item.wordMeans);
    setformDataExps(params.item.wordExample);
    setFormData({
      wg_id: params.item.wordgroup.wg_id,
      wg_sub_id: 0,
      w_name: params.item.w_name,
      w_id:params.item.w_id,
      w_mains:params.item.wordMeans,
      w_image:params.item.w_image,
      examples:params.item.wordExample,
      irregular:[],
    });
  }
}, []); 


  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if(name==='wg_id')
    {
      handleInputChange('wg_sub_id',0);
      console.log(groupData);
      const mean=groupData.find(x=>x.key===value);
      if(mean.child.length!==0)
      {
        const formattedData = mean.child.map(item => {
          // Her bir öğe için yeni bir nesne oluştur
          return {
            key: item.wg_id.toString(), // Key değeri wg_id'nin bir dize olarak dönüştürülmüş hali
            value: item.wg_name, // Value değeri wg_name'in kendisi
            parent_id:item.wg_parent_id
          };
        });

         setgroupSubData(formattedData);
        setsubGroupIsActive(true);
      }
      else
      {
        setgroupSubData([]);
        setsubGroupIsActive(false);
      }
    }
  };

  const handleformDataMeans = (name, value) => {
    setformDataMean((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log('form',formDataMean);
  };

  const handleformDataIrregular = (name, value) => {
    setformDataIrregular((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log('form',formDataIrregular);
  };
  const handleformDataExp = (name, value) => {
    setformDataExp((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddExps = (name, value) => {
    // Eklemeye çalıştığınız veri zaten var mı kontrol et
    const isExpExists = formDataExps.some(item => item.name === formDataExp.name);

    if (isExpExists) {
      // Veri zaten var, kullanıcıya uyarı göster
      alert(LanguageFind("this_exps_has_already_been_added"));
    } else {
      // Eklenmeye çalışılan veri yoksa, eklemeyi devam ettir
      setformDataExps(prevDataMeans => [...prevDataMeans, formDataExp]);
    }
  };


  const handleAddMeans = () => {
    // Eklemeye çalıştığınız veri zaten var mı kontrol et
    console.log(formDataMeans);
     const isMeanExists = formDataMeans.some(item => item.wm_name === formDataMean.mean && item.meantype.mt_short_name === formDataMean.type);

    if (isMeanExists) {
      // Veri zaten var, kullanıcıya uyarı göster
      alert(LanguageFind("this_meaning_has_already_been_added"));
    } else {
      // Eklenmeye çalışılan veri yoksa, eklemeyi devam ettir
      const x={
        wm_name:formDataMean.mean,
        meantype:{mt_short_name:formDataMean.type}
      }
      setformDataMeans(prevDataMeans => [...prevDataMeans, x]);
    }
  };
  const handleAddItem = () => {
    // wg_id: 0,
    // wg_sub_id: 0,
    // w_name: '',
    // w_id:0,
    // w_mains:[],
    // w_image:'',
    // examples:[],
    // irregular:[],
    let fexp=[];
    formDataExps.forEach(exp => {
      fexp.push({
        create_date:"2024-03-13T14:09:54.766Z",
        update_date:"2024-03-13T14:09:54.766Z",
        we_id:0,
        we_name:exp.we_name,
        w_id:0
      });
    });

    let fmean=[];
    formDataMeans.forEach(mean => {
      let mtypeBul=typeData.find(x=>x.key==mean.meantype.mt_short_name);
      fmean.push(
        {
          create_date:"2024-03-13T14:09:54.766Z",
          update_date:"2024-03-13T14:09:54.766Z",
          mt_id:mtypeBul!==null && mtypeBul!==undefined? mtypeBul.id:0,
          wm_id:0,
          wm_name:mean.wm_name
        });
    });
  

    if(formData.wg_id===undefined || formData.wg_id==='' || formData.wg_id===null)
    {
      alert(LanguageFind("group_field_is_a_mandatory_field._Please_fill_in_the_required_field"));
      return;
    }
    
    if(formDataMeans.length===0)
    {
      alert(LanguageFind('you_did_not_enter_a_meaning_for_the_word'));
      return;
    }


    let firr=[];
    if(formDataMeans.filter(x=>x.meantype.mt_short_name==='f.').length>0)
    {
      if(formDataIrregular.irr1===undefined || formDataIrregular.irr1==='' || formDataIrregular.irr1===null)
      {
        alert(LanguageFind('you_did_not_enter_the_1st_form_of_the_verb'));
        return;
      }
      if(formDataIrregular.irr2===undefined || formDataIrregular.irr2==='' || formDataIrregular.irr2===null)
      {
        alert(LanguageFind('you_did_not_enter_the_2st_form_of_the_verb'));
        return;
      }
      if(formDataIrregular.irr3===undefined || formDataIrregular.irr3==='' || formDataIrregular.irr3===null)
      {
        alert(LanguageFind('you_did_not_enter_the_3st_form_of_the_verb'));
        return;
      }
      firr.push({
        create_date:"2024-03-13T14:09:54.766Z",
        update_date:"2024-03-13T14:09:54.766Z",
        ir_id:0,
        ir_name:formDataIrregular.irr1,
        ir_status:1,
        w_id:0
      });
      firr.push({
        create_date:"2024-03-13T14:09:54.766Z",
        update_date:"2024-03-13T14:09:54.766Z",
        ir_id:0,
        ir_name:formDataIrregular.irr2,
        ir_status:2,
        w_id:0
      });
      firr.push({
        create_date:"2024-03-13T14:09:54.766Z",
        update_date:"2024-03-13T14:09:54.766Z",
        ir_id:0,
        ir_name:formDataIrregular.irr3,
        ir_status:3,
        w_id:0
      });
    }
    else
    {
      firr=[];
    }

    const data={
      group:+formData.wg_id,
      sub_group:+formData.wg_sub_id,
      words:[{
        create_date:"2024-03-13",
        foreign_language_id:0,
        update_date:"2024-03-13",
        w_id:0,
        w_image:formData.w_image,
        w_is_success:false,
        w_name:formData.w_name,
        wg_id:0,
        word_example_model:fexp,
        word_means_model:fmean,
        irregular_verbs_model:firr,
        explanation:formData.explanation
      }]
    };

    crudApi({data:data,type:(params!==undefined)?1:0});
 
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setFormData((prevData) => ({
        ...prevData,
        w_image: result.uri,
      }));
    }
  };
  const handleRemoveMean = (index) => {
    // Silme işlevini gerçekleştir
    const newMeans = [...formDataMeans];
    newMeans.splice(index, 1);
    setformDataMeans(newMeans);
  };
  const handleRemoveExp = (index) => {
    // Silme işlevini gerçekleştir
    const newExps = [...formDataExps];
    newExps.splice(index, 1);
    setformDataExps(newExps);
  };

  return (
<>

<View style={[styles.formContainer, { borderTopColor: '#e9e7e7', borderTopWidth: 1, borderStyle: 'solid', zIndex: 1,borderRadius:0,padding:10,paddingTop:20 }]}>
      <Text style={[styles.label]}><b>{LanguageFind('group')}</b></Text>
   
      <SelectList 
        setSelected={(val) =>  handleInputChange('wg_id', val)} 
        data={groupData} 
        save="key"
        name="wg_id"
        boxStyles={{borderBottomLeftRadius:0,borderBottomRightRadius:0,borderTopLeftRadius:5,borderTopRightRadius:5}}
        dropdownStyles={{borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomLeftRadius:5,borderBottomRightRadius:5}}
        defaultOption={groupData.find(item => +item.key === +formData.wg_id)}
        value={formData.wg_id}
    />
      

        {subGroupIsActive?
        <View>
     <Text style={styles.label}><b>{LanguageFind('sub_group')}</b></Text>
   
   <SelectList 
     setSelected={(val) =>  handleInputChange('wg_sub_id', val)} 
     data={groupSubData} 
     save="key"
     name="wg_sub_id"
     boxStyles={{borderBottomLeftRadius:0,borderBottomRightRadius:0,borderTopLeftRadius:5,borderTopRightRadius:5}}
     dropdownStyles={{borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomLeftRadius:5,borderBottomRightRadius:5}}
 />
     </View>
     :null}
     

      <Text style={[styles.label,{marginTop:10}]}><b>{LanguageFind('english_word')}</b></Text>
 <TextInput
          style={[styles.input, { backgroundColor: 'white' }]}
          value={formData.w_name}
          placeholder={LanguageFind('new_word_add_placeholder')}
          onChangeText={(text) => handleInputChange('w_name', text)}
          name='w_name'
        />

      {/* burası arraye atılacak */}
      <Text style={styles.label}><b>{LanguageFind('means')}:</b></Text>
      <View style={styles.means}>
        <Text style={styles.label}>Anlamı</Text>
        <TextInput
          style={[styles.input, { backgroundColor: 'white' }]}
          value={formDataMean.mean}
          placeholder={LanguageFind('mean_placeholder')}
          onChangeText={(text) => handleformDataMeans('mean', text)}
        />
        <Text style={styles.label}>{LanguageFind('type')}</Text>

        <SelectList 
        setSelected={(val) => handleformDataMeans('type', val)} 
        data={typeData} 
        save="key"
        boxStyles={{borderBottomLeftRadius:0,borderBottomRightRadius:0,borderTopLeftRadius:5,borderTopRightRadius:5}}
        dropdownStyles={{borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomLeftRadius:5,borderBottomRightRadius:5}}
    />

  
      

     

        <View style={{flexDirection: 'row'}}>
                        <View style={[styles.buttonContainer,{padding: "4px",width: "100%"}]}>
                            <button 
                            style={{backgroundColor:"rgb(232 255 234)",transitionDuration:"0s",border: "1px dotted rgb(161, 196, 165)",color: "#1f8600",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold"}} 
                            onClick={() => handleAddMeans()}>{LanguageFind('add')}</button>
                        </View>
                </View> 

        {formDataMeans.length > 0 ? (
          <View style={[styles.wordCard, { backgroundColor: '#b4e0ff', borderRadius: 5, marginTop: 4, textAlign: "center" }]}>
            <View>
              <Text style={{ textAlign: "left", marginTop: 4, marginBottom: 4, marginLeft: 10 }}>{LanguageFind('added_word_meanings')}</Text>
              {formDataMeans.map((m, index) => (
                <View style={[styles.wordMains, { marginTop: 5, marginBottom: 5, marginLeft: 10 }]} key={index}>
                  <FontAwesome name="circle" size={10} color="#000" style={{ marginRight: 5 }} />
                  <Text style={[styles.exampleSentence, { lineHeight: '3px' }]}>{m.wm_name} <span style={{ backgroundColor: 'orange', color: 'white', paddingLeft: 4, paddingRight: 4, borderRadius: 2, marginBottom: 2 }}>{m.meantype.mt_short_name}</span></Text>
                  <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => handleRemoveMean(index)}>
                    <FontAwesome style={[styles.exampleSentence, { lineHeight: '3px' }]} name="trash" size={15} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ) : null}


      </View>

      {formDataMeans.filter(x=>x.meantype.mt_short_name==='f.').length>0?
      <>
      <Text style={styles.label}><b>{LanguageFind('irregular_verbs')}:</b></Text>
      <View style={styles.means}>
        <Text style={styles.label}>{LanguageFind('state_1')}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: 'white' }]}
          value={formDataIrregular.irr1}
          placeholder={LanguageFind('enter_the_state_1')}
          onChangeText={(text) => handleformDataIrregular('irr1', text)}
        />

        <Text style={styles.label}>{LanguageFind('state_2')}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: 'white' }]}
          value={formDataIrregular.irr2}
          placeholder={LanguageFind('enter_the_state_2')}
          onChangeText={(text) => handleformDataIrregular('irr2', text)}
        />
        <Text style={styles.label}>{LanguageFind('state_3')}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: 'white' }]}
          value={formDataIrregular.irr3}
          placeholder={LanguageFind('enter_the_state_3')}
          onChangeText={(text) => handleformDataIrregular('irr3', text)}
        />
        </View>
        </>:null}
      

        

      <Text style={styles.label}><b>{LanguageFind('image_url')}:</b></Text>
      <View style={[styles.means, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
        <>
        {formData.w_image && <Image source={{ uri: formData.w_image }} style={{ width: 200, height: 200 }} />}
                        <View style={[styles.buttonContainer,{padding: "4px",width: "100%"}]}>
                            <button 
                            style={{backgroundColor:"rgb(232 255 234)",transitionDuration:"0s",border: "1px dotted rgb(161, 196, 165)",color: "#1f8600",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold"}} 
                            onClick={() => pickImage()}>{LanguageFind('add_image')}</button>
                        </View>

        </>
      </View>
   
      {/* bu kısım arraye atılacak */}
      <Text style={styles.label}><b>{LanguageFind('example_sentences')}:</b></Text>
      <View style={styles.means}>
        <Text style={styles.label}>{LanguageFind('sentence')}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: 'white' }]}
          value={formDataExp.name}
          onChangeText={(text) => handleformDataExp('we_name', text)}
        />
        {/* <TouchableOpacity style={[styles.addButton, { backgroundColor: 'blue', color: 'white' }]} onPress={handleAddExps}>
          <Text style={[styles.buttonText, { color: 'white' }]} >Ekle</Text>
        </TouchableOpacity> */}

        <View style={[styles.buttonContainer,{padding: "4px",width: "100%"}]}>
                            <button 
                            style={{backgroundColor:"rgb(232 255 234)",transitionDuration:"0s",border: "1px dotted rgb(161, 196, 165)",color: "#1f8600",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold"}} 
                            onClick={() => handleAddExps()}>{LanguageFind('add_example')}</button>
                        </View>


        {formDataExps.length > 0 ? (
          <View style={[styles.wordCard, { backgroundColor: '#b4e0ff', borderRadius: 5, marginTop: 4, textAlign: "center" }]}>
            <View>
              <Text style={{ textAlign: "left", marginTop: 4, marginBottom: 4, marginLeft: 10 }}>{LanguageFind('added_example_sentences')}</Text>
              {formDataExps.map((m, index) => (
                <View style={[styles.wordMains, { marginTop: 5, marginBottom: 5, marginLeft: 10 }]} key={index}>
                  <FontAwesome name="circle" size={10} color="#000" style={{ marginRight: 5 }} />
                  <Text style={[styles.exampleSentence, { lineHeight: '3px' }]}>{m.we_name}</Text>
                  <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => handleRemoveExp(index)}>
                    <FontAwesome style={[styles.exampleSentence, { lineHeight: '3px' }]} name="trash" size={15} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ) : <></>}


    


      </View>
      <Text style={styles.label}>{LanguageFind('explanation')}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: 'white',height: 60 }]}
          value={formData.explanation}
          placeholder={LanguageFind('explanation')}
          multiline={true}
          onChangeText={(text) => handleInputChange('explanation', text)}
        />
     
    </View>

   <View style={[styles.buttonContainer,{padding: "4px",width: "100%"}]}>
                            <button 
                            style={params==undefined?{backgroundColor:"rgb(232 255 234)",transitionDuration:"0s",border: "1px dotted rgb(161, 196, 165)",color: "#1f8600",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold"}:{backgroundColor:"rgb(255 244 232)",transitionDuration:"0s",border: "1px dotted rgb(196 183 161)",color: "rgb(163 106 4)",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold"}} 
                            onClick={() => handleAddItem()}>{params==undefined?<b>{LanguageFind('word_card_create')}</b>:<b>{LanguageFind('word_card_update')}</b>}</button>
                        </View>
   
   </>
  );
};

const ExcelAddItemForm = ({ onBulkAddItems }) => {

  const [items, setItems] = useState([]);
  const [groupData, setgroupData] = React.useState([]);
const [typeData, setmeanTypesData] = React.useState([]);
const [groupSubData, setgroupSubData] = React.useState([]);
const [subGroupIsActive, setsubGroupIsActive] = useState(false);


const handleInputChange = (name, value) => {
 
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
  if(name==='wg_id')
  {
    handleInputChange('wg_sub_id',0);
    const mean=groupData.find(x=>x.key===value);
    if(mean.child.length!==0)
    {
      const formattedData = mean.child.map(item => {
        // Her bir öğe için yeni bir nesne oluştur
        return {
          key: item.wg_id.toString(), // Key değeri wg_id'nin bir dize olarak dönüştürülmüş hali
          value: item.wg_name, // Value değeri wg_name'in kendisi
          parent_id:item.wg_parent_id
        };
      });

       setgroupSubData(formattedData);
      setsubGroupIsActive(true);
    }
    else
    {
      setgroupSubData([]);
      setsubGroupIsActive(false);
    }
  }
};
const [formData, setFormData] = useState({
  wg_id: 0,
  wg_sub_id: 0,
  w_name: '',
  w_id:0,
  w_mains:[],
  w_image:'',
  examples:[],
  irregular:[],
  explanation:''
});
useEffect(() => {
  const fetchgroupData = async () => {
      const chats = await wordGroups();
      setgroupData(chats);
  };
  const fetchmeansTypeData = async () => {
    const chats = await meansType();
    setmeanTypesData(chats);
  };
  fetchgroupData(); 
  fetchmeansTypeData(); 
}, []); 

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      // chats = [
      //   {
      //       id: '1', en: 'about', means: [
      //           { mean: 'hemen hemen', type: 'zf.' },
      //           { mean: 'aşağı yukarı', type: 'zf.' },
      //           { mean: 'yaklaşık', type: 'zf.' },
      //       ],
      //       examples: [{ name: 'it is about' }, { name: 'she is about' }]
      //       , image: 'https://images-na.ssl-images-amazon.com/images/S/pv-target-images/ae4816cade1a5b7f29787d0b89610132c72c7747041481c6619b9cc3302c0101._RI_TTW_.jpg'
      //   },

      const duzenliIfade = /\s*\[.*?\]\s*/g;
      let fullData=[];
      console.log(d);
      d.map((m, index) => {
        let data = m;
        let column = {};
        let trs = [];
        let exps= [];
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const value = data[key];
             console.log(`${key}: ${value}`);
            if (key == 'en') {
              column.w_id = 0;
              column.w_name = value;
              column.foreign_language_id = 0;
              column.wg_id = 0;
              column.w_image = '';
              column.w_is_success = false;
              column.update_date = "2024-03-13";
              column.create_date = "2024-03-13";
      
            }
            if (key.includes('tr')) {
              let tr = {};
              tr.wm_id=0;
              var mtypeBul=null;
              if (value.includes('[zf.]')) {
                mtypeBul=typeData.find(x=>x.key=='zf.');
              }
              if (value.includes('[i.]')) {
                mtypeBul=typeData.find(x=>x.key=='i.');
              }
              if (value.includes('[s.]')) {
                mtypeBul=typeData.find(x=>x.key=='s.');
              }
              if (value.includes('[c.]')) {
                mtypeBul=typeData.find(x=>x.key=='c.');
              }
              if (value.includes('[f.]')) {
                mtypeBul=typeData.find(x=>x.key=='f.');
              }
              if (value.includes('[zm.]')) {
                mtypeBul=typeData.find(x=>x.key=='zm.');
              }
              if (value.includes('[ed.]')) {
                mtypeBul=typeData.find(x=>x.key=='ed.');
              }
              if (value.includes('[bağ.]')) {
                mtypeBul=typeData.find(x=>x.key=='bağ.');
              }
              tr.update_date = "2024-03-13T14:09:54.766Z";
              tr.create_date = "2024-03-13T14:09:54.766Z";
              tr.mt_id =mtypeBul!==null? mtypeBul.id:0;
              tr.wm_name = value.replace(duzenliIfade, '');

              trs.push(tr);
            }
            // if(key.includes('irr'))
            // {

            // }
            if (key.includes('exp')) {
              let exp = {};
              exp.we_id = 0;
              exp.we_name = value;
              exp.w_id = 0;
              exp.update_date = "2024-03-13T14:09:54.766Z";
              exp.create_date = "2024-03-13T14:09:54.766Z";
              exps.push(exp);
            }

          }
        }
        column.word_means_model=trs;
        column.word_example_model=exps;
        console.log(column);
        fullData.push(column);
      }
      )
      // console.log(fullData);
        setItems(fullData);
      
    });
  };
  const handleAddItem = () => {
    if(formData.wg_id==undefined || formData.wg_id=='' || formData.wg_id==null)
    {
      alert(LanguageFind('group_field_is_a_mandatory_field_please_fill_in_the_required_field'));
    }
    if(items.length===0)
    {
      alert(LanguageFind('excel_import_file'));
    }
    const fetchwordsAdd= async () => {
      await wordsAdd({
        group:+formData.wg_id,
        sub_group:+formData.wg_sub_id,
        words:items
      }).then((x) => {
          // fetchwordGroupData(); 
        }).catch(err => console.log(err));
    };
    fetchwordsAdd(); 
  };
  return (
    <View style={[styles.formContainer, { borderTopColor: '#e9e7e7', borderTopWidth: 1, borderStyle: 'solid', zIndex: 1,borderRadius:0,padding:10,paddingTop:20,height:'100%' }]}>
     <Text style={[styles.label]}><b>{LanguageFind('excel_import_file')}</b></Text>
      <input
      style={styles.fileBorder}
      type="file"
      onChange={(e) => {
        const file = e.target.files[0];
        readExcel(file);
      }}
    />

<Text style={[styles.label]}><b>{LanguageFind('group')}</b></Text>
   
      <SelectList 
        setSelected={(val) =>  handleInputChange('wg_id', val)} 
        data={groupData} 
        save="key"
        name="wg_id"
        boxStyles={{borderBottomLeftRadius:0,borderBottomRightRadius:0,borderTopLeftRadius:5,borderTopRightRadius:5}}
        dropdownStyles={{borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomLeftRadius:5,borderBottomRightRadius:5}}
    />
     
     {subGroupIsActive?
     <View>
  <Text style={styles.label}><b>{LanguageFind('sub_group')}</b></Text>

    <SelectList 
      setSelected={(val) =>  handleInputChange('wg_sub_id', val)} 
      data={groupSubData} 
      save="key"
      name="wg_sub_id"
      boxStyles={{borderBottomLeftRadius:0,borderBottomRightRadius:0,borderTopLeftRadius:5,borderTopRightRadius:5}}
      dropdownStyles={{borderTopLeftRadius:0,borderTopRightRadius:0,borderBottomLeftRadius:5,borderBottomRightRadius:5}}
    />
  </View>
  :''}

      {/* <View style={styles.container}> */}
        {/* <View style={styles.addItemContainer}>
          {items.length!=0? <FlatList
            data={items}
            renderItem={({ item }) => (
                <ChatItem
                    item={item}
                    // onItemLongPress={() => onItemLongPress(item.id)}
                    // onItemPress={() => onItemPress(item.id)}
                    // selectedItems={selectedItems}
                />
            )}
            keyExtractor={(item) => item.en}
            style={styles.flatList}
        />:<></>}
        </View> */}


        <TouchableOpacity onPress={handleAddItem} style={[styles.addButton, { backgroundColor: 'blue', color: 'white',marginTop:5 }]}>
     <Text style={[styles.buttonText, { color: 'white' }]}>{LanguageFind('add_word _cards')}</Text>
   </TouchableOpacity>

    </View>
  );
};
const ChatItem = ({ item}) => {
  const adverbs = item.means.filter(x => x.type === 'zf.');
  const verbs = item.means.filter(x => x.type === 'f.');
  const cumle = item.means.filter(x => x.type === 'c.');
  const adjectives = item.means.filter(x => x.type === 's.');
  const pronouns = item.means.filter(x => x.type === 'zm.');
  const nouns = item.means.filter(x => x.type === 'i.');
  const edat = item.means.filter(x => x.type === 'ed.');
  const baglac = item.means.filter(x => x.type === 'bağ.');

  // ...

  return (
      <TouchableOpacity
      style={[
          styles.listItem,
          {
              marginVertical: 5,
              marginHorizontal: 10,
              // backgroundColor: selectedItems.includes(item.id) ? '#ddd' : '#fff',
          },
      ]}
      // onLongPress={() => onItemLongPress(item.id)}
      // onPress={() => onItemPress(item.id)}
  >
          {item.image!=undefined && item.image!=null && item.image!=''?<Image source={{ uri: item.image }} style={styles.avatar} />:<></>}

          <View style={styles.listItemContent}>

          <View style={styles.chatInfo}>
              {/* İngilizce kelime kartı */}
              <View style={styles.wordCard}>
                  <View style={styles.wordDetails}>
                      <Text style={styles.wordText}><h3><b>{item.en}</b></h3></Text>
                  </View>
                  <FontAwesomeIcon name="volume-high" size={24} color="#888" style={styles.soundIcon}  onPress={() => speak(item.en)}/> {/* Ses ikonu */}
              </View>
          {adverbs.length!=0?<View style={styles.wordCard}>
              <View style={styles.wordMains}>
                  <Text style={styles.wordMain}><b>Adverbs :</b> </Text>
                  <Text style={styles.wordMain}>
                      {adverbs.map((m, index) => 
                          <span key={index}>{m.mean}{index < adverbs.length - 1 ? ' ,' : ' '}</span>
                      )}
                  </Text>
              </View>
          </View>:<></>}
          
          {nouns.length!=0?
          <View style={styles.wordCard}>
              <View style={styles.wordMains}>
                  <Text style={styles.wordMain}><b>Noun :</b> </Text>
                  <Text style={styles.wordMain}>
                  {nouns.map((m, index) => 
                      <span key={index}>{m.mean}{index < nouns.length - 1 ? ' ,' : ' '}</span>
                  )}
                  </Text>
              </View>
          </View>
          :<></>}

          {adjectives.length!=0?
          <View style={styles.wordCard}>
              <View style={styles.wordMains}>
                  <Text style={styles.wordMain}><b>Adjective :</b> </Text>
                  <Text style={styles.wordMain}>
                  {adjectives.map((m, index) => 
                     <span key={index}>{m.mean}{index < adjectives.length - 1 ? ' ,' : ' '}</span>
                  )}
                  </Text>
              </View>
          </View>
           :<></>}


          {pronouns.length!=0?
          <View style={styles.wordCard}>
              <View style={styles.wordMains}>
                  <Text style={styles.wordMain}><b>Pronoun :</b> </Text>
                  <Text style={styles.wordMain}>
                  {pronouns.map((m, index) => 
                      <span key={index}>{m.mean}{index < pronouns.length - 1 ? ' ,' : ' '}</span>
                  )}
                  </Text>
              </View>
          </View>
          :<></>}

          {verbs.length!=0?
          <View style={styles.wordCard}>
              <View style={styles.wordMains}>
                  <Text style={styles.wordMain}><b>Verb :</b> </Text>
                  <Text style={styles.wordMain}>
                  {verbs.map((m, index) => 
                      <span key={index}>{m.mean}{index < verbs.length - 1 ? ' ,' : ' '}</span>
                  )}
                  </Text>
              </View>
          </View>
          :<></>}

        {cumle.length!=0?
          <View style={styles.wordCard}>
              <View style={styles.wordMains}>
                  <Text style={styles.wordMain}><b>Sentence :</b> </Text>
                  <Text style={styles.wordMain}>
                  {cumle.map((m, index) => 
                      <span key={index}>{m.mean}{index < cumle.length - 1 ? ' ,' : ' '}</span>
                  )}
                  </Text>
              </View>
          </View>
          :<></>}

        {edat.length!=0?
          <View style={styles.wordCard}>
              <View style={styles.wordMains}>
                  <Text style={styles.wordMain}><b>Preposition :</b> </Text>
                  <Text style={styles.wordMain}>
                  {edat.map((m, index) => 
                      <span key={index}>{m.mean}{index < edat.length - 1 ? ' ,' : ' '}</span>
                  )}
                  </Text>
              </View>
          </View>
          :<></>}

        {baglac.length!=0?
          <View style={styles.wordCard}>
              <View style={styles.wordMains}>
                  <Text style={styles.wordMain}><b>Conjunction :</b> </Text>
                  <Text style={styles.wordMain}>
                  {baglac.map((m, index) => 
                      <span key={index}>{m.mean}{index < baglac.length - 1 ? ' ,' : ' '}</span>
                  )}
                  </Text>
              </View>
          </View>
          :<></>}

          {item.examples.length!=0?
         <View style={[styles.wordCard, { backgroundColor: '#b4e0ff', borderRadius: 5, marginTop: 4, textAlign: "center" }]}>
              <View >
                  <Text style={{ textAlign: "left",marginTop:4,marginBottom:4,marginLeft:10 }}><b>Examples :</b></Text>
                  {item.examples.map((m, index) => (
                      <View style={[styles.wordMains,{marginTop:4,marginBottom:4,marginLeft:10}]} key={index}>
                          <FontAwesome name="circle" size={10} color="#000" style={{ marginRight: 5 }} /> {/* Nokta ikonu */}
                          <Text style={[styles.exampleSentence,{lineHeight:'2px'}]}>{m.name}</Text>
                      </View>
                  ))}
              </View>
          </View>
          :<></>}
          </View>
          </View>
      </TouchableOpacity>
  );
};
const AddItemFormComponent = ({route,closeModal,crudApi,groupData,typeData}) => {
  console.log(route);
  const [activeForm, setActiveForm] = useState('singleItem'); // Varsayılan olarak tek öğe formunu göster

  const handleAddItem = () => {
    // Tek öğe ekleme işlevi
    // ...

    // Daha sonra, formu değiştirin
    setActiveForm('bulkItem');
  };

  const handleBulkAddItems = () => {
    // Toplu öğeleri ekleme işlevi
    // ...

    // Daha sonra, formu değiştirin
    setActiveForm('singleItem');
  };
  return (
    <ScrollView style={{ flexGrow: 1,width:"95%",marginTop:"10px"}}>
      
        <View style={[styles.formContainer, { borderTopColor: '#e9e7e7', borderTopWidth: 1, borderStyle: 'solid', zIndex: 1,borderRadius:0,padding:10,paddingTop:20,borderRadius:10 }] }>
        <View style={route.params!=undefined?{flexDirection: 'row'}:{flexDirection: 'row',borderBottom:"1px solid #e2e2e2",marginBottom:23}}>
        <Text style={{padding:0,width: "100%",margin: 0,fontSize:20}}>{route.params==undefined?<b>{LanguageFind('word_card_create')}</b>:<b>{route.params.item.w_name} {LanguageFind('update')}</b>}</Text>
          <TouchableOpacity onPress={() => closeModal()} style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
                <Text>X</Text>
              </TouchableOpacity>
        </View>

          {route.params==undefined?<>
            <View style={styles.tabMenu}>
            <TouchableOpacity onPress={() => setActiveForm('singleItem')} style={[styles.tabButton, activeForm === 'singleItem' && styles.activeTabButton]}>
              <Text style={styles.buttonText}>{route.params===undefined?<b>{LanguageFind('create_word_card')}</b>:<b>{route.params.item.w_name} {LanguageFind('update_word_card')}</b>}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveForm('bulkItem')} style={[styles.tabButton, activeForm === 'bulkItem' && styles.activeTabButton]}>
              <Text style={styles.buttonText}>{LanguageFind('bulk_upload')}</Text>
            </TouchableOpacity>
          </View>
          <View style={{marginTop:'-2px'}}>
            {activeForm === 'singleItem' && <AddItemForm onAddItem={handleAddItem} crudApi={crudApi}  groupData={groupData} typeData={typeData} />}
            {activeForm === 'bulkItem' && <ExcelAddItemForm onBulkAddItems={handleBulkAddItems} crudApi={crudApi}  groupData={groupData} typeData={typeData}/>}
          </View></>:
          <AddItemForm onAddItem={handleAddItem} params={route.params} crudApi={crudApi}  groupData={groupData} typeData={typeData}/>
          }
         
        </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  addItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
},
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
},
  wordCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordMains: {
    flexDirection: 'row', // Yazıları yatayda sıralamak için
    flexWrap: 'wrap',
    marginLeft: 10,
    width:'100%'
  },
  wordMain: {
    marginRight: 5,       // Yazılar arasına boşluk bırakmak için
  },

  fileBorder: {
    borderColor: '#e9e7e7',  // Sağdan, soldan ve üstten border rengi
    borderWidth: 1,        // Sağdan, soldan ve üstten border kalınlığı
    borderStyle: 'solid',  // Sağdan, soldan ve üstten border stil
    padding: 5
  },

  listItem: {
    // padding: 10,
    // borderRadius: 10,
    marginBottom: 10,
    paddingBottom:20
  },
  tabMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 0,
    zIndex: 10,
  },
  tabButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    zIndex: 10,
    paddingBottom:20
  },
  activeTabButton: {
    backgroundColor: 'white',
    borderColor: '#e9e7e7',  // Sağdan, soldan ve üstten border rengi
    borderBottomColor: '#fff',  // Sağdan, soldan ve üstten border rengi
    borderWidth: 1,        // Sağdan, soldan ve üstten border kalınlığı
    borderStyle: 'solid',  // Sağdan, soldan ve üstten border stil
    
    marginTop: -1,         // Sağdan, soldan ve üstten border kalınlığı için ayar
    marginRight: -1,       // Sağdan, soldan ve üstten border kalınlığı için ayar
    marginLeft: -1,
    zIndex: 2,
    paddingBottom:20

  },

  means: {
    padding: 10,
    backgroundColor: '#e9e7e7',
    borderRadius: 10,
    marginBottom: 10,
  },
  formContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
  picker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  flatList: {
    flex: 1,
},
listItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 10,
},
listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
},
avatar: {
    width: '100%',
    height: 100,
    marginRight: 0,
    borderRadius: 10,
},
chatInfo: {
    flex: 1,
},

});

export default AddItemFormComponent;
