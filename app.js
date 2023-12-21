

let allCourses = []

const loadCategories = () => {
    fetch('https://openapi.programming-hero.com/api/videos/categories')
        .then(res => res.json())
        .then(data => displayCategories(data.data))

}



const displayCategories = categories => {

    const categoriesContainer = document.getElementById('categories-row');
    for (const category of categories) {

        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('col');
        categoryDiv.classList.add('col-md-3');
        categoryDiv.classList.add('col-sm-6');
        categoryDiv.classList.add('mb-1');
        categoryDiv.classList.add(`${category.category_id}`);

        categoryDiv.innerHTML = `
            <button  onclick="loadByCategory('${category.category_id}')" class="btn btn-secondary d-flex align-items-center justify-content-center">${category.category}</button>        
        `;
        categoriesContainer.appendChild(categoryDiv);
    }
    loadByCategory(1000);
}


const loadByCategory = (id, toSort = false) => {
    const cat_btn = document.getElementsByClassName(`${id}`);

    //make other button class secondary
    const categoriesContainer = document.getElementById('categories-row');

    for (let i = 0; i < categoriesContainer.children.length; i++) {
        let btn = categoriesContainer.children[i].children[0];
        if (btn.classList.contains('btn-secondary')) {
            continue;
        }
        else if (btn.classList.contains('btn-danger')) {
            btn.classList.remove('btn-danger')
            btn.classList.add('btn-secondary')
        }
        else {

        }
    }

    //make id button class danger


    if (cat_btn[0].children[0].classList.contains('btn-secondary')) {
        cat_btn[0].children[0].classList.remove('btn-secondary')
        cat_btn[0].children[0].classList.add('btn-danger')
    }

    // https://restcountries.com/v3.1/alpha/{code}
    const url = ` https://openapi.programming-hero.com/api/videos/category/${id}`

    fetch(url)
        .then(res => res.json())

        .then(data => {
            displayCourseByCategory(data.data)
        })
}


function convertTime(time) {
    let timeNumber = parseInt(time);
    const hour = Math.floor(timeNumber / 3600);
    timeNumber = timeNumber - (hour * 3600);
    const minute = Math.floor(timeNumber / 60);
    return { hour, minute }

}

const displayCourseByCategory = coursesByCategory => {

    const courseContainer = document.getElementById('course-row');
    courseContainer.innerHTML = ""
    const notFoundDiv = document.getElementById("not-found")

    const sortBtn = document.getElementById('sort')
    sortBtn.addEventListener('click', function () {
        coursesByCategory.map((c) => {
            let str = c.others.views
            let s = str.substr(0, str.length - 1)
            c.sort_param = parseFloat(s);
            return c;
        })

        coursesByCategory.sort((a, b) => {

            return (b.sort_param - a.sort_param)
        })


        displayCourseByCategory(coursesByCategory)
    })


    if (coursesByCategory.length == 0) {
        notFoundDiv.classList.remove("d-none")
        return;
    } else {
        notFoundDiv.classList.add("d-none");
        for (const course of coursesByCategory) {

            const courseDiv = document.createElement('div');
            courseDiv.classList.add('course');
            let authorVerified;

            let havePostedDate = false
            let dateDisplay;
            let hourAndMinute;
            if (course.others.posted_date !== "") {
                havePostedDate = true;
                dateDisplay = "d-block";
                hourAndMinute = convertTime(course.others.posted_date);
            } else {
                dateDisplay = "d-none";
            }
            let hour, minute;
            if (havePostedDate) {
                hour = hourAndMinute.hour;
                minute = hourAndMinute.minute;
            }


            if (course.authors[0].verified !== "") {
                authorVerified = 'd-block';
            } else {
                authorVerified = 'd-none';
            }
            courseDiv.innerHTML = `<div class="col">
                    <div class="card">
                        <div style="positon:relative;height:300px; background-image: url(${course.thumbnail}); background-repeat: no-repeat;background-position: center;background-size: cover;"> 
                            <div class="${dateDisplay}" style="margin-left:150px;margin-top:265px; positon:absolute;bottom:10px;left:5px;color:white">
                                 <span class="bg-dark py-1" style="border-radius:3px;">${hour}hrs ${minute} min ago</span>
                            </div>
                        </div>
                    
                      <div class="card-body">
                        <div class="row">
                            <div class="col col-2">
                                <img src="${course.authors[0].profile_picture}" alt="Avatar" class="avatar" style=" vertical-align: middle;width: 50px;height: 50px;
                                border-radius: 50%;">
                            </div>
                            <div class="col col-10">
                                <h3 class="fw-bold card-title">${course.title}</h3>
                                <div class="d-flex">
                                    <p class="card-text d-inline-block me-3">${course.authors[0].profile_name}   </p>
                                    <i style="font-size:20px;" class="text-primary fw-bold ${authorVerified} bi bi-patch-check-fill d-inline"></i>
                                    
                                </div>
                                <p class="card-text">${course.others.views} views</p>
                                <p class="card-text"></p>
                            </div>
                        </div>
                           
                         </div>
                        </div>
                    </div>`;

            courseContainer.appendChild(courseDiv);
        }
    }

}


loadCategories();   