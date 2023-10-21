package com.sofi.sofi_app;

import android.app.DownloadManager;
import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import java.io.StringReader;


public class TodayActivity extends AppCompatActivity {
    RequestQueue queue;
    TextView TodayText;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.today_activity_main);
        getSupportActionBar().setIcon(R.drawable.sofi_2);
        getSupportActionBar().setDisplayUseLogoEnabled(true);
        getSupportActionBar().setDisplayShowHomeEnabled(true);

        TodayText = (TextView) findViewById(R.id.TodayText);

        if(queue == null) {
            queue = Volley.newRequestQueue(this);
        }

        String url = "http://115.85.182.143:5501/getFood";

        StringRequest stringRequest = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {

                TodayText.setText(UnicodeToUTF_8(response));
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                TodayText.setText("에러: " + error.toString());
            }
        });
        queue.add(stringRequest);
    }
    public String UnicodeToUTF_8(String uni){
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
}
