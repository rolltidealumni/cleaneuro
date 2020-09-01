import React, {
  useState,
  useEffect
} from "react";
import realTime from "../../firebase/firebase";
import Post from "./Post";
import Card from "@material-ui/core/Card";

import {
  connect
} from "react-redux";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Moment from "moment";
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from "@material-ui/core/Tooltip";
import Popover from "@material-ui/core/Popover";
import FlatButton from "material-ui/FlatButton";
import InputLabel from "@material-ui/core/InputLabel";
import Box from "@material-ui/core/Box";
import cameraLogo from "../../static/camera-two.svg";
import filter from "../../static/filter.svg";
import lens from "../../static/lens.svg";
import aperture from "../../static/aperture.svg";
import category from "../../static/label.svg";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { FormControl } from "@material-ui/core";

const Posts = (props) => {
  const [filterValue, setFilterValue] = useState({ value: "", key: "" });
  const [sort] = useState({ sort: "submitted", order: "asc" });
  const [ordered, setOrdered] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(false);
  const [cameraList, setCameraList] = useState([]);
  const [lensList, setLensList] = useState([]);
  const [apertureList, setApertureList] = useState([]);
  const [lensValue, setLensValue] = useState("");
  const [apertureValue, setApertureValue] = useState("");
  const [strict, setStrict] = useState([]);
  const [cameraValue, setCameraValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");

  let postCameras = [];
  let postLens = [];
  let postAperture = [];

  useEffect(() => {
    let mounted = true;
    getPosts(mounted);
    return () => (mounted = false);
    // eslint-disable-next-line
    }, [props.user], realTime
  );

  const getDays = (submit) => {
    var today = Moment().endOf('day').format('YYYY-MM-DD');
    return today <= Moment(Moment(submit)).add(7, 'd').format('YYYY-MM-DD')
  }

  const numDays = (submit) => {
    var given = Moment(submit, "YYYY-MM-DD");
    var today = Moment().endOf('day').format('YYYY-MM-DD');
    return Moment.duration(given.diff(today)).asDays();
  }

  const getPosts = (mounted) => {
    let temp = [];
    let postz = [];
    setPostLoading(true);
    realTime
      .ref("posts")
      .orderByChild(sort.sort)
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          postz.push(snapshot.val());
          let keys = Object.keys(postz[0]);
          var result = Object.keys(postz[0]).map(function (key) {
            return [Number(key), postz[0][key]];
          });
          result.forEach(function (child, i) {
            postCameras.push(child[1].camera);
            postLens.push(child[1].lens);
            postAperture.push(child[1].aperture);
            temp.push({
              index: i,
              key: keys[i],
              expires: Moment(Moment(child[1].submitted)).add(7, 'd').format("dddd, MMMM Do"),
              expireDays: numDays(Moment(child[1].submitted).add(7, 'd')),
              submitted: child[1].submitted,
              imageLink: child[1].imageLink,
              aperture: child[1].aperture,
              lens: child[1].lens,
              camera: child[1].camera,
              category: child[1].category,
              author: child[1].author,
              location: child[1].location,
              oneStar: child[1].oneStar,
              twoStars: child[1].twoStars,
              threeStars: child[1].threeStars,
              fourStars: child[1].fourStars,
              fiveStars: child[1].fiveStars,
              editorspick: child[1].editorspick,
              total: child[1].total,
              average:
                (5 * child[1].fiveStars +
                  4 * child[1].fourStars +
                  3 * child[1].threeStars +
                  2 * child[1].twoStars +
                  1 * child[1].oneStar) /
                (child[1].fiveStars +
                  child[1].fourStars +
                  child[1].threeStars +
                  child[1].twoStars +
                  child[1].oneStar),
            });
          });
        }
        if (mounted) {
          if (!filterValue.value) {
            setCameraList([...new Set(postCameras.sort((a, b) => (a > b ? 1 : -1)))]);
            setLensList([...new Set(postLens.sort((a, b) => (a > b ? 1 : -1)))]);
            setApertureList([...new Set(postAperture.sort((a, b) => (a > b ? 1 : -1)))]);
          }

          setOrdered(
            deDupe(temp.sort((a, b) => (getDays(a.submitted) < getDays(b.submitted) ? 1 : -1))
              .filter(i => getDays(i.submitted)))
          );
          setPosts(
            deDupe(temp.sort((a, b) => (getDays(a.submitted) < getDays(b.submitted) ? 1 : -1))
              .filter(i => getDays(i.submitted)))
          );
          setStrict(
            deDupe(temp.sort((a, b) => (getDays(a.submitted) < getDays(b.submitted) ? 1 : -1))
              .filter(i => getDays(i.submitted)))
          );
          setPostLoading(false);
        }
      });
  }

  const deDupe = (array) => {
    return array.reduce((acc, current) => {
      const x = acc.find(item => item.key === current.key);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
  }

  const updateFilter = (value, key) => {
    let results = [];
    let keyState = key + "Value";
    let numFilters = 0;
    if (cameraValue !== "") numFilters++;
    if (lensValue !== "") numFilters++;
    if (apertureValue !== "") numFilters++;
    if (categoryValue !== "") numFilters++;

    if (value !== "") {
      if (ordered.length === 0 || ([keyState] !== "" && numFilters === 0)) {
        results = strict.filter(item => {
          return (item[key] === value)
        });
        setPosts(
          deDupe(results.sort((a, b) => (getDays(a.submitted) < getDays(b.submitted) ? 1 : -1))
            .filter(i => getDays(i.submitted)))
        );
        setOrdered(
          deDupe(results.sort((a, b) => (getDays(a.submitted) < getDays(b.submitted) ? 1 : -1))
            .filter(i => getDays(i.submitted)))
        );
      } else {
        results = ordered.filter(item => {
          return (item[key] === value)
        });
        setPosts(
          deDupe(results.sort((a, b) => (getDays(a.submitted) < getDays(b.submitted) ? 1 : -1))
            .filter(i => getDays(i.submitted)))
        );
        setOrdered(
          deDupe(results.sort((a, b) => (getDays(a.submitted) < getDays(b.submitted) ? 1 : -1))
            .filter(i => getDays(i.submitted)))
        );
      }
    }

    if (value === "") {
      setPosts(
        deDupe(strict.sort((a, b) => (getDays(a.submitted) < getDays(b.submitted) ? 1 : -1))
          .filter(i => getDays(i.submitted)))
      );
      setOrdered(
        deDupe(strict.sort((a, b) => (getDays(a.submitted) < getDays(b.submitted) ? 1 : -1))
          .filter(i => getDays(i.submitted)))
      );
    }
  };

  const updateRating = (post, key, rating) => {
    setPostLoading(true);
    if (rating === 1) {
      props.firebase.ref("posts/" + key).update({
        oneStar: post.oneStar + 1,
        total: post.total + 1,
      });
    } else if (rating === 2) {
      props.firebase.ref("posts/" + key).update({
        twoStars: post.twoStars + 1,
        total: post.total + 1,
      });
    } else if (rating === 3) {
      props.firebase.ref("posts/" + key).update({
        threeStars: post.threeStars + 1,
        total: post.total + 1,
      });
    } else if (rating === 4) {
      props.firebase.ref("posts/" + key).update({
        fourStars: post.fourStars + 1,
        total: post.total + 1,
      });
    } else if (rating === 5) {
      props.firebase.ref("posts/" + key).update({
        fiveStars: post.fiveStars + 1,
        total: post.total + 1,
      });
    }
    setPostLoading(false);
  };

  return (
    <div>
      <div id="sort-pagination" >
        <PopupState variant="popover" popupId="mobile-filter-icon">
          {(popupState) => (
            <div id="mobile-filter-icon">
              <Tooltip title="Filter">
                <img
                  id="filterIcon"
                  src={filter}
                  alt="filter"
                  {...bindTrigger(popupState)}
                  style={{ float: "right" }}
                />
              </Tooltip>
              <Popover
                // marginThreshold={86}
                {...bindPopover(popupState)}
                // anchorPosition={{ top: 10, left: 20 }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Box p={2}>
                  <FormControl
                    variant="outlined"
                    style={{
                      width: "200px",
                      marginTop: "20px",
                    }}
                  >
                    <InputLabel id="demo-simple-select-helper-label">
                      <img
                        alt="camera"
                        src={cameraLogo}
                        width="18px"
                        style={{ verticalAlign: "middle", marginRight: "5px" }}
                      />{" "}
                      <span>Camera</span>
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      onChange={(e) => {
                        setCameraValue(e.target.value);
                        updateFilter(e.target.value, "camera");
                      }}
                      value={cameraValue}
                      label={
                        <span>
                          <img
                            alt="camera"
                            src={cameraLogo}
                            width="18px"
                            style={{
                              verticalAlign: "middle",
                              marginRight: "5px",
                            }}
                          />
                          <span style={{ verticalAlign: "middle" }}>
                            Camera
                          </span>
                        </span>
                      }
                    >
                      <MenuItem value=""> </MenuItem>
                      {cameraList.map((camera, i) => {
                        return (
                          <MenuItem key={i} value={camera}>
                            {camera}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <br />
                  <FormControl
                    variant="outlined"
                    style={{
                      width: "200px",
                      marginTop: "20px",
                    }}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      <span>
                        <img
                          alt="lens"
                          src={lens}
                          width="18px"
                          style={{
                            verticalAlign: "middle",
                            marginRight: "5px",
                          }}
                        />
                        <span style={{ verticalAlign: "middle" }}>Lens</span>
                      </span>
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      onChange={(e) => {
                        setLensValue(e.target.value);
                        updateFilter(e.target.value, "lens");
                      }}
                      value={lensValue}
                      label={
                        <span>
                          <img
                            alt="lens"
                            src={lens}
                            width="18px"
                            style={{
                              verticalAlign: "middle",
                              marginRight: "5px",
                            }}
                          />
                          <span style={{ verticalAlign: "middle" }}>Lens</span>
                        </span>
                      }
                    >
                      <MenuItem value=""> </MenuItem>
                      {lensList.map((lens, i) => {
                        return (
                          <MenuItem key={i} value={lens}>
                            {lens}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <br />
                  <FormControl
                    variant="outlined"
                    style={{
                      width: "200px",
                      marginTop: "20px",
                    }}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      <span>
                        <img
                          alt="aperture"
                          src={aperture}
                          width="18px"
                          style={{
                            verticalAlign: "middle",
                            marginRight: "5px",
                          }}
                        />
                        <span style={{ verticalAlign: "middle" }}>
                          Aperture
                        </span>
                      </span>
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      onChange={(e) => {
                        setApertureValue(e.target.value);
                        updateFilter(e.target.value, "aperture");
                      }}
                      value={apertureValue}
                      label={
                        <span>
                          <img
                            alt="category"
                            src={aperture}
                            width="18px"
                            style={{
                              verticalAlign: "middle",
                              marginRight: "5px",
                            }}
                          />
                          <span style={{ verticalAlign: "middle" }}>
                            Aperture
                          </span>
                        </span>
                      }
                    >
                      <MenuItem value=""> </MenuItem>
                      {apertureList.map((aperture, i) => {
                        return (
                          <MenuItem key={i} value={aperture}>
                            {aperture}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <br />
                  <FormControl
                    variant="outlined"
                    style={{
                      width: "200px",
                      marginTop: "20px",
                    }}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      <span>
                        <img
                          alt="lens"
                          src={category}
                          width="18px"
                          style={{
                            verticalAlign: "middle",
                            marginRight: "5px",
                          }}
                        />
                        <span style={{ verticalAlign: "middle" }}>
                          Category
                        </span>
                      </span>
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      onChange={(e) => {
                        setCategoryValue(e.target.value);
                        updateFilter(e.target.value, "category");
                      }}
                      value={categoryValue}
                      label={
                        <span>
                          <img
                            alt="lens"
                            src={category}
                            width="18px"
                            style={{
                              verticalAlign: "middle",
                              marginRight: "5px",
                            }}
                          />
                          <span style={{ verticalAlign: "middle" }}>
                            Category
                          </span>
                        </span>
                      }
                    >
                      <MenuItem value="">
                        <em>none</em>
                      </MenuItem>
                      <MenuItem value={"automotive"}>automotive</MenuItem>
                      <MenuItem value={"black & white"}>black & white</MenuItem>
                      <MenuItem value={"cityscape"}>cityscape</MenuItem>
                      <MenuItem value={"film"}>film</MenuItem>
                      <MenuItem value={"landscape"}>landscape</MenuItem>
                      <MenuItem value={"nature"}>nature</MenuItem>
                      <MenuItem value={"portrait"}>portrait</MenuItem>
                    </Select>
                  </FormControl>
                  <center>
                    <br />
                    <FlatButton
                      label="RESET"
                      primary={true}
                      className="cancelBtn"
                      onClick={() => {
                        setApertureValue("");
                        setLensValue("");
                        setCameraValue("");
                        setCategoryValue("");
                        setFilterValue({ key: "", value: "" });
                        updateFilter("", "");
                      }}
                      style={{ marginBottom: "10px", width: "100%" }}
                    />
                  </center>
                </Box>
              </Popover>
            </div>
          )}
        </PopupState>

        <div>
          <Card style={{ backgroundColor: 'transparent' }} id="web-filter-row">
            <Box id="filterRow" p={2}>
              <FormControl
                variant="outlined"
                style={{
                  width: "150px",
                  marginRight: '10px',
                  marginTop: '-10px'
                }}>
                <InputLabel id="demo-simple-select-helper-label" >
                  <img alt="camera"
                    src={cameraLogo}
                    width="18px"
                    style={{ verticalAlign: "middle", marginRight: "5px" }}
                  /><span>Camera</span>
                </InputLabel>
                <Select labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  onChange={
                    (e) => {
                      setCameraValue(e.target.value);
                      updateFilter(e.target.value, "camera");
                    }
                  }
                  value={
                    cameraValue
                  }
                  label={
                    <span>
                      <img
                        alt="camera"
                        src={
                          cameraLogo
                        }
                        width="18px"
                        style={{
                          verticalAlign: "middle",
                          marginRight: "5px",
                        }}
                      /> <span style={{
                        verticalAlign: "middle"
                      }}>Camera</span>
                    </span>
                  }><MenuItem value=""></MenuItem>
                  {cameraList.map((camera, i) => {
                    return (<MenuItem key={i} value={camera}> {camera} </MenuItem>)
                  })} </Select>
              </FormControl>
              <FormControl
                variant="outlined"
                style={
                  {
                    width: "105px",
                    marginRight: '10px',
                    marginTop: '-10px'
                  }
                } >
                <InputLabel id="demo-simple-select-outlined-label" >
                  <span >
                    <img alt="lens"
                      src={
                        lens
                      }
                      width="18px"
                      style={
                        {
                          verticalAlign: "middle",
                          marginRight: "5px",
                        }
                      }
                    /> <span style={
                      {
                        verticalAlign: "middle"
                      }
                    }> </span>Lens</span> </InputLabel> <Select labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      onChange={
                        (e) => {
                          setLensValue(e.target.value);
                          updateFilter(e.target.value, "lens");
                        }
                      }
                      value={
                        lensValue
                      }
                      label={<span>
                        <img
                          alt="lens"
                          src={
                            lens
                          }
                          width="18px"
                          style={
                            {
                              verticalAlign: "middle",
                              marginRight: "5px",
                            }
                          }
                        /> <span style={
                          {
                            verticalAlign: "middle"
                          }
                        }> Lens</span> </span>
                      } >
                  <MenuItem value="" > </MenuItem> {
                    lensList.map((lens, i) => {
                      return (<MenuItem key={
                        i
                      }
                        value={
                          lens
                        } > {
                          lens
                        } </MenuItem>
                      );
                    })
                  } </Select> </FormControl> <FormControl
                    variant="outlined"
                    style={
                      {
                        width: "150px",
                        marginRight: '10px',
                        marginTop: '-10px'
                      }
                    } >
                <InputLabel id="demo-simple-select-outlined-label" >
                  <span>
                    <img alt="aperture"
                      src={
                        aperture
                      }
                      width="18px"
                      style={
                        {
                          verticalAlign: "middle",
                          marginRight: "5px",
                        }
                      } /> <span style={
                        {
                          verticalAlign: "middle"
                        }
                      } > </span> Aperture</span> </InputLabel> <Select labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        onChange={
                          (e) => {
                            setApertureValue(e.target.value);
                            updateFilter(e.target.value, "aperture");
                          }
                        }
                        value={
                          apertureValue
                        }
                        label={<span>
                          <img
                            alt="category"
                            src={
                              aperture
                            }
                            width="18px"
                            style={
                              {
                                verticalAlign: "middle",
                                marginRight: "5px",
                              }
                            }
                          /> <span style={
                            {
                              verticalAlign: "middle"
                            }
                          } > Aperture</span> </span >
                        } >
                  <MenuItem value="" > </MenuItem> {
                    apertureList.map((aperture, i) => {
                      return (<MenuItem key={
                        i
                      }
                        value={
                          aperture
                        } > {
                          aperture
                        } </MenuItem>);
                    })
                  } </Select> </FormControl> <FormControl
                    variant="outlined"
                    style={
                      {
                        width: "150px",
                        marginRight: '10px',
                        marginTop: '-10px'
                      }
                    } >
                <InputLabel id="demo-simple-select-outlined-label" >
                  <span><img alt="lens"
                    src={
                      category
                    }
                    width="18px"
                    style={
                      {
                        verticalAlign: "middle",
                        marginRight: "5px",
                      }
                    }
                  /> <span style={
                    {
                      verticalAlign: "middle"
                    }
                  } > Category</span></span> </InputLabel> <Select
                    onChange={
                      (e) => {
                        setCategoryValue(e.target.value);
                        updateFilter(e.target.value, "category");
                      }
                    }
                    value={
                      categoryValue
                    }
                    label={<span>
                      <img
                        alt="lens"
                        src={
                          category
                        }
                        width="18px"
                        style={
                          {
                            verticalAlign: "middle",
                            marginRight: "5px",
                          }
                        }
                      /> <span style={
                        {
                          verticalAlign: "middle"
                        }
                      } > Category </span> </span>}>
                  <MenuItem value="" ><em> none </em></MenuItem>
                  <MenuItem value={"automotive"} > automotive </MenuItem> <MenuItem value={"black & white"} > black & white </MenuItem>
                  <MenuItem value={"cityscape"} > cityscape </MenuItem> <MenuItem value={"film"} > film </MenuItem> <MenuItem value={"landscape"} > landscape </MenuItem> <MenuItem value={"nature"} > nature </MenuItem>
                  <MenuItem value={
                    "portrait"
                  } > portrait </MenuItem></Select > </FormControl>
              <FlatButton label="RESET"
                primary={
                  true
                }
                style={{ width: '50px' }}
                className="resetBtn"
                onClick={
                  () => {
                    setApertureValue("");
                    setLensValue("");
                    setCameraValue("");
                    setCategoryValue("");
                    setFilterValue({
                      key: "",
                      value: ""
                    });
                    updateFilter("", "");
                  }
                }
              /> </Box> </Card > </div> </div> <div className="cards" > {
                postLoading ? (<LinearProgress id="line-progress"
                  style={
                    {
                      display: 'absolute',
                      top: '48px',
                      backgroundColor: 'white'
                    }
                  }
                />
                ) : posts.length > 0 ? (
                  posts.map((post, i) => {
                    return (
                      <Post
                        showZoomModal={(image) => props.showZoomModal(image)}
                        isAuthenticated={props.isAuthenticated}
                        showEditModal={(post) => props.showEditModal(post)}
                        postLoading={postLoading}
                        adminFlag={props.adminFlag}
                        key={i}
                        id={i}
                        openCritique={(post) => props.openCritique(post)}
                        post={post}
                        updateRating={(post, i, rating) =>
                          updateRating(post, post.key, rating)
                        }
                        {...props}
                      />
                    );
                  })
                ) : (<span className="no-results" > There are no posts to display </span>)}
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
    user: state.auth.user,
  };
}

export default connect(mapStateToProps)(Posts);