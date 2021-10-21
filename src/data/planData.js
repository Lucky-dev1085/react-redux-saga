//import React, { Component, Fragment } from "react";
// import { database } from '../helpers/Firebase';


function get_plansData() {
        const planData_list = [
            {
                title: 'STARTER',
                price: '$30',
                detail: 'USD/MONTH',
                link: '#',
                features: [
                    '1 WordPress install',
                    '20,000 visits',
                    '5 GB disk space',
                    'Free SSL & CDN'
                ]
            },
            {
                title: 'PRO',
                price: '$60',
                detail: 'USD/MONTH',
                link: '#',
                features: [
                    '2 WordPress install',
                    '40,000 visits',
                    '10 GB disk space',
                    'Free SSL & CDN'
                ]
            }
        ];
    
        // database.ref('Plan_List/en/10').set({
        //     name: "ENTERPRISE 4",
        //     price: "1500",
        //     install_num: 150,
        //     monthly_visits: 3000000,
        //     SSD_stroage: 200,
        //     free_CDN: 1000,
        //     storage_unit: "GB",
        //     free_premium_migrations: 5,
        //     free_migrations_other: true,
        //     google_cloud_platform: true,
        //     global_location_20: true,
        //     multisite_support: true,
        //     automaitc_daily_backups: true,
        //     manual_backup: true,
        //     backup_retention_day: 30,
        //     support_24_7: true,
        //     multi_user_environment: true,
        //     staging_area: true,
        //     php_7_3_support: true,
        //     free_SSL_certificates: true,
        //     imported_SSL_certificates: true,
        //     php_workers_per_site: 16,
        //     recommended_e_sites: true,
        //     site_cloning: true,
        //     SSH_access: true
            
        // }, function(error) {
        //   if (error) {
        //     console.log("db connection error");
        //   } else {
        //     console.log("Data saved successfully!");
        //   }
        // });
    
        // database.ref('/Plan_List/en').once('value', function(snapshot) {
        //     snapshot.forEach(function(childSnapshot) {
        //         var childKey = childSnapshot.key;
        //         var childData = childSnapshot.val();
        //         // console.log("childKey");
        //         // console.log(childKey);
        //         // console.log("childData");
        //         // console.log(childData.name);

        //         var showData = {
        //             title: childData.name,
        //             price: '$' + childData.price,
        //             detail: 'USD/MONTH',
        //             link: '#',
        //             features: []
        //         };
        //         showData.features.push(childData.install_num + ' WordPress install');
        //         showData.features.push(childData.monthly_visits + ' visits');
        //         showData.features.push(childData.SSD_stroage + ' GB disk space');
        //         showData.features.push('Free SSL & CDN');

        //         planData_list.push(showData);
        //     });
        //     console.log("--------plan data = ", JSON.stringify(planData_list));
        //     return planData_list;
        // });

        return planData_list
}

const plansData = get_plansData();

export { plansData };

