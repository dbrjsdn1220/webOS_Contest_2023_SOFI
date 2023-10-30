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

public class UserActivity extends AppCompatActivity {
    RequestQueue queue;
    TextView UserText;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.user_activity_main);
        getSupportActionBar().setIcon(R.drawable.sofi_2);
        getSupportActionBar().setDisplayUseLogoEnabled(true);
        getSupportActionBar().setDisplayShowHomeEnabled(true);

        UserText = (TextView) findViewById(R.id.UserText);

        if(queue == null) {
            queue = Volley.newRequestQueue(this);
        }

        String url = "http://115.85.182.143:5501/getUser";

        StringRequest stringRequest = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                String u_text = User_UnicodeToUTF_8(response);
                String text = User_StringToJson(u_text);
                UserText.setText(text);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                UserText.setText("에러: " + error.toString());
            }
        });
        queue.add(stringRequest);
    }
    public String User_UnicodeToUTF_8(String uni){
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

    public  String User_StringToJson(String uni) {
        String textserch, allergy, name, id, textall = "";
        String unitext = uni.substring(1,uni.length()-2);
        String text = unitext.replace("\n", "");
        while(true) {
            try {
                if (!text.contains("{") || !text.contains("}"))
                    break;
                textserch = text.substring(text.indexOf("{") + 1, text.indexOf("}") - 1);
                text = text.substring(text.indexOf("}") + 1);
                id = textserch.substring(textserch.indexOf("id")+4, textserch.indexOf("name")-6);

                name = textserch.substring(textserch.indexOf("name")+8, textserch.length()-2);

                allergy = textserch.substring(16, textserch.indexOf("id")-7);
                textall = "ID: " + id + "\n이름: " + name + "\n알러지: " + allergy + "\n\n" + textall;
            }
            catch (IndexOutOfBoundsException e) {
                System.out.println("123123");
                break;
            }
        }
        return textall;
    }
}
