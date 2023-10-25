package com.sofi.sofi_app;

import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

public class AllActivity extends AppCompatActivity {
    RequestQueue queue;
    TextView AllText;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.all_activity_main);
        getSupportActionBar().setIcon(R.drawable.sofi_2);
        getSupportActionBar().setDisplayUseLogoEnabled(true);
        getSupportActionBar().setDisplayShowHomeEnabled(true);

        AllText = (TextView) findViewById(R.id.AllText);

        if(queue == null) {
            queue = Volley.newRequestQueue(this);
        }

        String url = "http://115.85.182.143:5501/getFood";

        StringRequest stringRequest = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                String unitext = All_UnicodeToUTF_8(response);
                String text = All_StringToJson(unitext);
                AllText.setText(text);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                AllText.setText("에러: " + error.toString());
            }
        });
        queue.add(stringRequest);
    }
    public String All_UnicodeToUTF_8(String uni){
        StringBuffer result = new StringBuffer();

        for(int i=0; i<uni.length(); i++){
            if(uni.charAt(i) == '\\' &&  uni.charAt(i+1) == 'u'){
                Character c = (char)Integer.parseInt(uni.substring(i+2, i+6), 16);
                result.append(c);
                i+=5;
            }else{
                result.append(uni.charAt(i));
            }
        }
        return result.toString();
    }

    public  String All_StringToJson(String uni) {
        String textserch, allergy, name, date, time, textall = "";
        String unitext = uni.substring(1,uni.length()-2);
        String text = unitext.replace("\n", "");
        while(true) {
            try {
                if (!text.contains("{") || !text.contains("}"))
                    break;
                textserch = text.substring(text.indexOf("{") + 1, text.indexOf("}") - 1);
                text = text.substring(text.indexOf("}") + 1);
                allergy = textserch.substring(textserch.indexOf("[")+1, textserch.indexOf("]"));
                allergy = allergy.replace("\"", "");
                allergy = allergy.replace(" ", "");
                allergy = allergy.replace(",", ", ");

                time = textserch.substring(textserch.indexOf("time")+8, textserch.length()-2);

                name = textserch.substring(textserch.indexOf("name")+8, textserch.indexOf("time")-7);

                date = textserch.substring(textserch.indexOf("date")+8, textserch.indexOf("id")-7);
                textall = "[" + time + "]\n제품명: " + name + "\n유통기한: " + date + "\n알러지: " + allergy + "\n\n" + textall;
            }
            catch (IndexOutOfBoundsException e) {
                break;
            }
        }
        return textall;
    }
}